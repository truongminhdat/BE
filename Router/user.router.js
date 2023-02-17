const express = require("express");
const { forgotPasswordController } = require("../Controller/forgotpassword");
const {
  createUser,
  getAllUser,
  getAllUserById,
  editUser,
  deleteUser
} = require("../Controller/User.controllers");

const userRouter = express.Router();

userRouter.post("/createuser", createUser);
userRouter.get("/getUserById", getAllUserById);
userRouter.patch("/edituser", editUser);
userRouter.delete("/deleteuser", deleteUser);

module.exports = userRouter;
