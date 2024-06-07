const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const channelMemberController = require("../controllers/channelMemberController");

const channelMemberRouter = express.Router({ mergeParams: true });
channelMemberRouter.use(authMiddleware.isLoggedIn);
channelMemberRouter.use(authMiddleware.isMemberOfChannel);

channelMemberRouter.get("/search", channelMemberController.search);

module.exports = channelMemberRouter;
