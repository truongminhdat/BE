const UserModel = require("../models/user.model");
const saltRounds = 10;
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(404).json({
      msg: "Input in the value",
    });
  }
  const user = await UserModel.findOne({
    where: {
      email: req.user.email,
    },
  });

  const isPassword = await bcrypt.compare(oldPassword, user.password);

  if (!isPassword) {
    return res.status(400).json({
      msg: "Wrong password or username",
    });
  }
  let hash = bcrypt.hashSync(newPassword, saltRounds);
  user.password = hash;
  user.save();
  return res.status(200).json({
    msg: "Change password success!",
  });
};
module.exports = {
  changePassword,
};
