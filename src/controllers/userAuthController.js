const {
  registerSchema,
  verifyOTPSchema,
} = require("../formSchemas/authSchemas");
const { generateOTP, encryptUserId, decryptUserId } = require("../helpers");
const OTP = require("../models/OTP");
const User = require("../models/User");
const emailService = require("../transporter/emailService");
const { mongoose } = require("mongoose");

const userAuthController = {
  register: async (req, res) => {
    try {
      await registerSchema.validate(req.body);
      const { email, password, firstName, lastName } = req.body;

      const newUser = new User({
        email,
        password,
        firstName,
        lastName,
      });

      const savedUser = await newUser.save();

      const otpCode = generateOTP();

      const newOTP = new OTP({
        code: otpCode,
        user: savedUser._id,
      });
      await newOTP.save();
      emailService.sendEmailVerificationOTP(savedUser, newOTP.code);
      res.json({
        _id: encryptUserId(savedUser._id),
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        isVerifed: savedUser.isVerifed,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        error,
        message: "email already exists or data not sent properly",
      });
    }
  },
  verifyOTP: async (req, res) => {
    try {
      const authorData = {
        _id: req.headers["user-id"],
        otp: req.body.otp,
      };
      await verifyOTPSchema.validate(authorData);
      const { _id: encryptedID, otp: receviedOTP } = authorData;
      const _id = decryptUserId(encryptedID);
      const userId = new mongoose.Types.ObjectId(_id);
      const otp = await OTP.findOne({ user: userId });
      if (otp === null)
        res
          .status(404)
          .json({ status: "error", message: "OTP Expired or not found" });
      else {
        if (receviedOTP === otp.code) {
          const user = await User.findById(userId);
          user.isVerifed = true;
          await user.save();
          await OTP.deleteOne({ user: userId });
          emailService.sendEmailVerifiedNotification(user);
          res.json({
            _id: encryptedID,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isVerifed: user.isVerifed,
          });
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Wrong OTP provided" });
        }
      }
    } catch (error) {
      res
        .status(404)
        .json({ status: "error", error, message: "User not found" });
    }
  },
  login: async (req, res) => {
    res.json({
      status: "working",
    });
  },
};

module.exports = userAuthController;
