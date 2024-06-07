const CHANNEL_SOCKET_EVENTS = require("../eventTypes/channelSocketEvents.type");

const conversationHandler = (io, socket) => {
  const create = async (data) => {
    socket
      .to(data._id.toString())
      .emit(CHANNEL_SOCKET_EVENTS.LOGGER, `U were added in dm!`);
  };

  socket.on(CHANNEL_SOCKET_EVENTS.REQ_CREATE_CONVERSATION, create);
};

module.exports = conversationHandler;
