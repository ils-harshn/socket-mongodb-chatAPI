const Member = require("../models/Members");

const channelMemberController = {
  search: async (req, res) => {
    try {
      const query = {
        name: req.query?.name || "",
      };
      const members = await Member.find({
        user: { $ne: req.user._id },
        memberName: new RegExp(query.name, "i"),
      }).select("memberName role");
      res.json(members);
    } catch (err) {
      res.status(500).json({});
    }
  },
};

module.exports = channelMemberController;
