const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const userRouter = require("./src/routers/userRouter");
const serverConfig = require("./config");
const channelRouter = require("./src/routers/channelRouter");
const initChannelSocket = require("./src/sockets/channelSocket");
const channelMemberRouter = require("./src/routers/channelMemberRouter");

mongoose
  .connect(serverConfig.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initChannelSocket(io);

const versions = {
  v1: "/api/v1",
};

const V1Router = express.Router();
V1Router.use("/user", userRouter);
V1Router.use("/channel", channelRouter);
V1Router.use("/:channelId/member", channelMemberRouter);

app.use(
  cors({
    origin: serverConfig.ALLOWED_ORIGINS,
  })
);
app.use(bodyParser.json());
app.use(versions.v1, V1Router);

const PORT = serverConfig.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
