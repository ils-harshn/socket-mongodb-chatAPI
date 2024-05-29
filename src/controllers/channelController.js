const { channelCreateSchema } = require("../formSchemas/channelFormSchemas");
const Channel = require("../models/Channel");

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
      res.json({
        _id: savedChannel._id,
        name: savedChannel.name,
        description: savedChannel.description,
      });
    } catch (error) {
      res.status(404).json({
        status: "error",
        error,
      });
    }
  },
};

module.exports = channelController;
