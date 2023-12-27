const {
  registerSchema,
  verifyOTPSchema,
  loginSchema,
  resendOTPSchema,
} = require("../formSchemas/authSchemas");
const {
  generateOTP,
  encryptUserId,
  decryptUserId,
  generateToken,
} = require("../helpers");
const bcrypt = require("bcrypt");
const OTP = require("../models/OTP");
const User = require("../models/User");
const emailService = require("../transporter/emailService");
const { mongoose } = require("mongoose");
const serverConfig = require("../../config");

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
        otp_timeout: serverConfig.OTP_TIMEOUT
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
    try {
      await loginSchema.validate(req.body);
      const { email, password } = req.body;
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        res
          .status(404)
          .json({ status: "error", message: "Invalid credentials" });
      } else if (user.isVerifed === false) {
        res.status(404).json({ status: "error", message: "User is inactive" });
      } else {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          res
            .status(404)
            .json({ status: "error", message: "Invalid credentials" });
        } else {
          res.json({
            _id: encryptUserId(user._id),
            email: user.email,
            token: generateToken(user._id.toString()),
          });
        }
      }
    } catch (error) {
      res
        .status(404)
        .json({ status: "error", message: "Email or password is wrong" });
    }
  },
  resendOTP: async (req, res) => {
    try {
      await resendOTPSchema.validate(req.body);
      const { email } = req.body;
      const user = await User.findOne({
        email,
      });
      if (user) {
        const otpCode = generateOTP();
        const newOTP = new OTP({
          code: otpCode,
          user: user._id,
        });

        await newOTP.save();
        emailService.sendEmailVerificationOTP(user, newOTP.code);
        res.json({
          _id: encryptUserId(user._id),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerifed: user.isVerifed,
          otp_timeout: serverConfig.OTP_TIMEOUT, 
        });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "No email address found" });
      }
    } catch (error) {
      res.status(404).json({
        status: "error",
        message: "Only one OTP at a time for a user",
      });
    }
  },
};

module.exports = userAuthController;
