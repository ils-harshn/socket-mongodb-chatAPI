const { mongoose } = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  adminName: {
    type: String,
    required: true,
  },
});

const Channel = mongoose.model("Channel", channelSchema);
module.exports = Channel;
