const { mongoose } = require("mongoose");

const otpSchema = new mongoose.Schema({
  code: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60,
  },
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
