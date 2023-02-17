const UserModel = require("../models/user.model");

const basicInfoController = async (req, res) => {
  const { id } = req.query;
  const basicInfo = await UserModel.findOne({
    where: {
      id: id,
    },
    attributes: {
      exclude: ["password"],
    },
  });
  return res.status(200).json({
    msg: "get profile data",
    basicInfo,
  });
};
module.exports = {
  basicInfoController,
};
