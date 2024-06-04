const {
  channelCreateSchema,
  channelInviteSchema,
} = require("../formSchemas/channelFormSchemas");
const Channel = require("../models/Channel");
const MemberRoles = require("../models/Consts/MemberRoles");
const SpaceMemberRoles = require("../models/Consts/SpaceMemberRoles");
const Member = require("../models/Members");
const Space = require("../models/Space");
const SpaceMember = require("../models/SpaceMember");

const channelController = {
  create: async (req, res) => {
    try {
      await channelCreateSchema.validate(req.body);
      const { channelName, adminName, channelDescription } = req.body;
      const newChannel = new Channel({
        name: channelName,
        description: channelDescription,
        adminName: adminName,
        adminId: req.user._id,
      });

      const savedChannel = await newChannel.save();
      const newMember = new Member({
        memberName: savedChannel.adminName,
        channel: savedChannel._id,
        user: req.user._id,
        role: MemberRoles.ADMIN,
      });

      await newMember.save();

      const general = await Space({
        name: "general",
        description: channelDescription,
        channel: newChannel._id,
        adminId: req.user._id,
      });

      await general.save();

      const spaceMember = await SpaceMember({
        space: general._id,
        member: newMember._id,
        role: SpaceMemberRoles.ADMIN,
      });

      await spaceMember.save();

      res.json({
        _id: savedChannel._id,
        name: savedChannel.name,
        description: savedChannel.description,
        adminName: savedChannel.adminName,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        error,
      });
    }
  },
  list: async (req, res) => {
    try {
      const memberChannels = await Member.find({
        user: req.user._id,
      })
        .populate("channel")
        .sort({ createdAt: -1 });
      res.json(memberChannels);
    } catch (error) {
      res.status(404).json({
        status: "error",
        error,
      });
    }
  },
  invite: async (req, res) => {
    try {
      const channelId = req.params.channelId;
      await channelInviteSchema.validate(req.body);
      const { emails: body_emails } = req.body;
      const emails = [...new Set(body_emails)];
      res.json({
        channelId,
        emails,
      });
    } catch (error) {}
  },
};

module.exports = channelController;
