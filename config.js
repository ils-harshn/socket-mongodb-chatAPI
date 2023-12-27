require("dotenv").config();

const serverConfig = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL: process.env.EMAIL,
  SALT_ROUND: parseInt(process.env.SALT_ROUND),
  SECRET_KEY: process.env.SECRET_KEY,
};

module.exports = serverConfig;
