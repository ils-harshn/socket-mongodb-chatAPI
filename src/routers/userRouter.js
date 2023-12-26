const express = require("express");
const userAuthController = require("../controllers/userAuthController");
const userRouter = express.Router();

userRouter.post("/register", userAuthController.register);
userRouter.post("/verifyOTP", userAuthController.verifyOTP);

module.exports = userRouter;
