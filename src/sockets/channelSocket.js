function initChannelSocket(io) {
  io.of(/^\/channel-\w+$/).on("connection", (socket) => {
    console.log(socket.id, socket.nsp.name.split("-")[1]);

    setTimeout(() => {
      socket.emit("connected");
    }, 2000);
  });
}

module.exports = initChannelSocket;
