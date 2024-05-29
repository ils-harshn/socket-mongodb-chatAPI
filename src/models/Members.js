const { mongoose } = require("mongoose");
const MemberRoles = require("./Consts/MemberRoles");

const memberSchema = new mongoose.Schema({
  memberName: {
    type: String,
    required: true,
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(MemberRoles),
    default: MemberRoles.MEMBER,
  },
});

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
