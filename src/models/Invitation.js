const { mongoose } = require("mongoose");

const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    message: "Only one invitaion allowed per user.",
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 3,
  },
});

invitationSchema.index({ email: 1, channel: 1 }, { unique: true });

const Invitation = mongoose.model("Invitation", invitationSchema);
module.exports = Invitation;
