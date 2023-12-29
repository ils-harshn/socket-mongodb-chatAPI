const express = require("express");
const userAuthController = require("../controllers/userAuthController");
const userRouter = express.Router();

userRouter.post("/register", userAuthController.register);
userRouter.post("/verifyOTP", userAuthController.verifyOTP);
userRouter.post("/login", userAuthController.login);
userRouter.post("/resendOTP", userAuthController.resendOTP);
userRouter.post("/logoutFromAllDevice", userAuthController.logoutFromAllDevice);
userRouter.post("/verifyUserToken", userAuthController.verifyUserToken);

module.exports = userRouter;
