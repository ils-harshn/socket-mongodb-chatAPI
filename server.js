const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRouter = require("./src/routers/userRouter");
const serverConfig = require("./config");

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

const V1Router = express.Router();
V1Router.use("/user", userRouter);

app.use(bodyParser.json());
app.use("/api/v1", V1Router);

const PORT = serverConfig.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
