const { mongoose } = require("mongoose");

const otpSchema = new mongoose.Schema({
  code: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, // OTP expires after 60 seconds (600 seconds)
  },
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
