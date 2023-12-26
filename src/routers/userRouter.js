const express = require("express");
const userAuthController = require("../controllers/userAuthController");
const userRouter = express.Router();

userRouter.get("/register", userAuthController.register);

module.exports = userRouter;
