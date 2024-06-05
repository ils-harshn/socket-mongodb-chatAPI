const { mongoose } = require("mongoose");
const { verifyUserTokenSchema } = require("../../formSchemas/authSchemas");
const User = require("../../models/User");
const Token = require("../../models/Token");
const { decryptUserId } = require("../../helpers");
const Member = require("../../models/Members");
const Channel = require("../../models/Channel");

const authChannelMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const channelId = new mongoose.Types.ObjectId(
        socket.nsp.name.split("-")[1]
      );
      const authorData = {
        _id: token._id,
        token: token.token,
        email: token.email,
      };
      await verifyUserTokenSchema.validate(authorData);
      const userId = new mongoose.Types.ObjectId(decryptUserId(authorData._id));
      const user = await User.findById(userId);
      if (!user || user.email !== authorData.email) {
        next(new Error("Connection Failed With Socket"));
      } else {
        const token = await Token.findOne({ user: userId });
        if (token && token.token === authorData.token) {
          const member = await Member.findOne({
            user: userId,
            channel: channelId,
          });
          if (member) {
            socket.user = {
              _id: user._id,
              member: member,
              email: user.email,
              name: member.memberName,
              role: member.role,
            };
            socket.channel = await Channel.findById(channelId);
            next();
          } else {
            next(
              new Error(
                "Channel not found or your are not a part of this channel."
              )
            );
          }
        } else {
          next(new Error("Authentication Failed"));
        }
      }
    } catch (error) {
      next(new Error("Connection Failed With Socket"));
    }
  } else {
    next(new Error("Connection Failed With Socket"));
  }
};

module.exports = authChannelMiddleware;
