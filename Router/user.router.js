const express = require("express");
const { forgotPasswordController } = require("../Controller/forgotpassword");
const { simpleEmail } = require("../Controller/mail.controller");
const {
  createUser,
  getAllUser,
  getAllUserById,
  editUser,
  deleteUser,
  resetPassword,
  updatePassword
} = require("../Controller/User.controllers");


const userRouter = express.Router();

userRouter.post("/createuser", createUser);
userRouter.get("/getUserById", getAllUserById);
userRouter.patch("/edituser", editUser);
userRouter.delete("/deleteuser", deleteUser);
userRouter.post("/sendPassword", resetPassword)
userRouter.post('/updatePassword', updatePassword)

module.exports = userRouter;
