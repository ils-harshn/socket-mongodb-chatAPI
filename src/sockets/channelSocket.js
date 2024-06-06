const authChannelMiddleware = require("../middlewares/socket/authChannelMiddleware");
const CHANNEL_SOCKET_EVENTS = require("./eventTypes/channelSocketEvents.type");
const spaceHandler = require("./handlers/spaceHandler");

function initChannelSocket(io) {
  const dynamicNamespace = io
    .of(/^\/channel-\w+$/)
    .use(authChannelMiddleware)
    .on(CHANNEL_SOCKET_EVENTS.CONNECTION, (socket) => {
      socket.emit(CHANNEL_SOCKET_EVENTS.CONNECTED, {
        user: {
          email: socket.user.email,
          name: socket.user.name,
        },
        channel: socket.channel,
      });

      spaceHandler(dynamicNamespace, socket);
    });
}

module.exports = initChannelSocket;
