const SpaceMember = require("../../models/SpaceMember");
const CHANNEL_SOCKET_EVENTS = require("../eventTypes/channelSocketEvents.type");

const spaceHandler = (io, socket) => {
  const list = async () => {
    try {
      const memberSpaces = await SpaceMember.find({
        member: socket.user.member._id,
      })
        .populate("space")
        .sort({ createdAt: -1 });
      socket.emit(CHANNEL_SOCKET_EVENTS.RES_SPACE_LIST, memberSpaces);
    } catch (error) {
      console.log(error);
      socket.emit(CHANNEL_SOCKET_EVENTS.RES_SPACE_LIST, []);
    }
  };

  socket.on(CHANNEL_SOCKET_EVENTS.REQ_SPACE_LIST, list);
};

module.exports = spaceHandler;
