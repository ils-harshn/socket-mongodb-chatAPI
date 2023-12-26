const { registerSchema } = require("../formSchemas/authSchemas");
const { generateOTP } = require("../helpers");
const OTP = require("../models/OTP");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const emailService = require("../transporter/emailService");

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
      await emailService.sendEmailVerificationOTP(savedUser, newOTP.code);
      res.json({
        _id: savedUser._id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        isVerifed: savedUser.isVerifed,
      });
    } catch (error) {
      res.json({ status: "Error", error });
    }
  },
};

module.exports = userAuthController;
