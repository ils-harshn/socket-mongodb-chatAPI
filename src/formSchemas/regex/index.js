const EMAIL_REGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const OTP_REGX = /^[0-9]{6}$/;

module.exports = {
  EMAIL_REGX,
  PASSWORD_REGX,
  OTP_REGX,
};
