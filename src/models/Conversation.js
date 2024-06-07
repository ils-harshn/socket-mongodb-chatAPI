const { mongoose } = require("mongoose");

const conversationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
    // default: null,
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
