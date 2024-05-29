const express = require("express");
const channelController = require("../controllers/channelController");
const authMiddleware = require("../middlewares/authMiddleware");

const channelRouter = express.Router();
channelRouter.use(authMiddleware.isLoggedIn);

channelRouter.post("/create", channelController.create);

module.exports = channelRouter;
