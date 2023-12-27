const express = require("express");
const userAuthController = require("../controllers/userAuthController");
const userRouter = express.Router();

userRouter.post("/register", userAuthController.register);
userRouter.post("/verifyOTP", userAuthController.verifyOTP);
userRouter.post("/login", userAuthController.login);
userRouter.post("/resendOTP", userAuthController.resendOTP);

module.exports = userRouter;
