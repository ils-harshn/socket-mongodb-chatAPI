const { mongoose } = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    validate: async function (userId) {
      const existingToken = await this.constructor.findOne({ user: userId });
      return !existingToken;
    },
    message: "Only one token allowed per user.",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // expires: 60,
    // no expiry for token right now
  },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
