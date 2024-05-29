const { mongoose } = require("mongoose");
const User = require("../models/User");
const { verifyUserTokenSchema } = require("../formSchemas/authSchemas");
const Token = require("../models/Token");
const { decryptUserId } = require("../helpers");

const authMiddleware = {
  isLoggedIn: async (req, res, next) => {
    try {
      const authorData = {
        _id: req.headers["user-id"],
        token: req.headers["user-token"],
        email: req.headers["user-email"],
      };
      await verifyUserTokenSchema.validate(authorData);
      const userId = new mongoose.Types.ObjectId(decryptUserId(authorData._id));
      const user = await User.findById(userId);
      if (!user || user.email !== authorData.email) {
        res
          .status(404)
          .json({ status: "error", message: "Authorization Failed" });
      } else {
        const token = await Token.findOne({ user: userId });
        if (token && token.token === authorData.token) {
          req.user = user;
          next();
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Authorization Failed" });
        }
      }
    } catch (error) {
      res.status(404).json({ status: "error", message: "Invalid request" });
    }
  },
};

module.exports = authMiddleware;
