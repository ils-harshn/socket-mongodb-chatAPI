const { channelCreateSchema } = require("../formSchemas/channelFormSchemas");

const channelController = {
  create: async (req, res) => {
    try {
      await channelCreateSchema.validate(req.body);
      const { channelName, adminName, channelDescription } = req.body;

      res.json(req.body);
    } catch (error) {
      res.status(404).json({
        status: "error",
        error,
      });
    }
  },
};

module.exports = channelController;
