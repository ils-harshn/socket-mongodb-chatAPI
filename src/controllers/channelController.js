const { channelCreateSchema } = require("../formSchemas/channelFormSchemas");
const Channel = require("../models/Channel");
const MemberRoles = require("../models/Consts/MemberRoles");
const Member = require("../models/Members");

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
        .sort({ _id: -1 });
      res.json(memberChannels);
    } catch (error) {
      console.log(error);
      res.status(404).json({
        status: "error",
        error,
      });
    }
  },
};

module.exports = channelController;
