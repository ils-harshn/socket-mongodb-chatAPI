const { mongoose } = require("mongoose");
const SpaceMemberRoles = require("./Consts/SpaceMemberRoles");

const spaceMemberSchema = new mongoose.Schema(
  {
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(SpaceMemberRoles),
      default: SpaceMemberRoles.MEMBER,
    },
  },
  { timestamps: true }
);

const SpaceMember = mongoose.model("SpaceMember", spaceMemberSchema);
module.exports = SpaceMember;
