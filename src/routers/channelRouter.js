const express = require("express");
const channelController = require("../controllers/channelController");
const authMiddleware = require("../middlewares/authMiddleware");

const channelRouter = express.Router();
channelRouter.use(authMiddleware.isLoggedIn);

channelRouter.post("/create", channelController.create);
channelRouter.get("/list", channelController.list);
channelRouter.post("/invite/:channelId", channelController.invite);
channelRouter.post(
  "/accept-invitation",
  channelController.acceptChannelInvitation
);

module.exports = channelRouter;
