require("dotenv").config();

const serverConfig = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL: process.env.EMAIL,
  SALT_ROUND: parseInt(process.env.SALT_ROUND),
  OTP_TIMEOUT: parseInt(process.env.OTP_TIMEOUT),
  SECRET_KEY: process.env.SECRET_KEY,
};

module.exports = serverConfig;
