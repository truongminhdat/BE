const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendEmail } = require("./email");
const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(404).json({
      msg: "Please enter valid email",
    });
  }
  const oldUser = await UserModel.findOne({
    where: {
      email: email,
    },
  });

  if (!oldUser) {
    return res.status(404).json({
      msg: "User is not found!",
    });
  }
  const accessToken = jwt.sign(
    JSON.stringify({
      email: oldUser.email,
      id: oldUser.id,
    }),
    process.env.JWT_SECRET
  );
  const link = `${process.env.URL_REACT}/password-reset/${oldUser.id}/${accessToken}`;
  await sendEmail({
    email,
    link,
  });
  return res.status(200).json({
    msg: "Success email ",
  });
};
const resetPasswordController = (req, res) => {
  req.body;
};
module.exports = {
  forgotPasswordController,
  resetPasswordController,
};
