const { mongoose } = require("mongoose");

const peerConnectionSchema = new mongoose.Schema({
  member_1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  member_2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
});

const PeerConnection = mongoose.model("PeerConnection", peerConnectionSchema);
module.exports = PeerConnection;
