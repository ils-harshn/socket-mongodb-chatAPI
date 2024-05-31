const authChannelMiddleware = require("../middlewares/socket/authChannelMiddleware");

function initChannelSocket(io) {
  const dynamicNamespace = io
    .of(/^\/channel-\w+$/)
    .use(authChannelMiddleware)
    .on("connection", (socket) => {});
}

module.exports = initChannelSocket;
