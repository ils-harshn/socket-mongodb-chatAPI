const {
  registerSchema,
  verifyOTPSchema,
} = require("../formSchemas/authSchemas");
const { generateOTP } = require("../helpers");
const OTP = require("../models/OTP");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const emailService = require("../transporter/emailService");
const { mongoose } = require("mongoose");

const userAuthController = {
  register: async (req, res) => {
    try {
      await registerSchema.validate(req.body);
      const { email, password, firstName, lastName } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
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
        _id: savedUser._id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        isVerifed: savedUser.isVerifed,
      });
    } catch (error) {
      res.status(404).json({ status: "Error", error });
    }
  },
  verifyOTP: async (req, res) => {
    try {
      await verifyOTPSchema.validate(req.body);
      const { _id, otp: receviedOTP } = req.body;
      const userId = new mongoose.Types.ObjectId(_id);
      const otp = await OTP.findOne({ user: userId });
      if (otp === null)
        res.status(404).json({ error: "OTP Expired or not found" });
      else {
        if (receviedOTP === otp.code) {
          const user = await User.findById(userId);
          user.isVerifed = true;
          await user.save();
          await OTP.deleteOne({ user: userId });
          res.json({
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isVerifed: user.isVerifed,
          });
        } else {
          res.status(404).json({ status: "Wrong OTP provided" });
        }
      }
    } catch (error) {
      res.status(404).json({ status: "Error", error });
    }
  },
};

module.exports = userAuthController;
