const authChannelMiddleware = require("../middlewares/socket/authChannelMiddleware");

function initChannelSocket(io) {
  const dynamicNamespace = io
    .of(/^\/channel-\w+$/)
    .use(authChannelMiddleware)
    .on("connection", (socket) => {
      socket.emit("connected", {
        user: {
          email: socket.user.email,
          name: socket.user.name,
        },
        channel: socket.channel,
      });
    });
}

module.exports = initChannelSocket;
