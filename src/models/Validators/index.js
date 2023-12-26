const { EMAIL_REGX, PASSWORD_REGX } = require("../../formSchemas/regex");

const Validators = {
  ValidateEmail: (value) => {
    return EMAIL_REGX.test(value);
  },
  ValidatePassword: (value) => {
    return PASSWORD_REGX.test(value);
  },
};

module.exports = Validators;
