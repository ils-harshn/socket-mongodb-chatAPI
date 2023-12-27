const CryptoJS = require("crypto-js");
const serverConfig = require("../../config");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Function to encrypt the user ID
const encryptUserId = (userId) => {
  const ciphertext = CryptoJS.AES.encrypt(
    userId.toString(),
    serverConfig.SECRET_KEY
  ).toString();
  return ciphertext;
};

// Function to decrypt the user ID
const decryptUserId = (encryptedUserId) => {
  const bytes = CryptoJS.AES.decrypt(encryptedUserId, serverConfig.SECRET_KEY);
  const decryptedUserId = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedUserId;
};

const generateToken = (userId) => {
  // Create a token using a combination of user ID and a timestamp
  const timestamp = Date.now().toString();
  const token = CryptoJS.HmacSHA256(
    userId + timestamp,
    serverConfig.SECRET_KEY
  ).toString(CryptoJS.enc.Base64);
  return token;
};

module.exports = {
  generateOTP,
  encryptUserId,
  decryptUserId,
  generateToken,
};
