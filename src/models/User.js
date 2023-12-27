const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ValidateEmail } = require("./Validators");
const serverConfig = require("../../config");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (email) {
        if (!ValidateEmail(email)) return false;
        const user = await this.constructor.findOne({ email });
        if (user) {
          if (this.id === user.id) {
            return true;
          }
          return false;
        }
        return true;
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    set: function (password) {
      const hashedPassword = bcrypt.hashSync(password, serverConfig.SALT_ROUND);
      return hashedPassword;
    },
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 30,
  },
  isVerifed: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
