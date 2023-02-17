const jwt = require("jsonwebtoken");
const { restart } = require("nodemon");
require("dotenv").config();

const getAccessTokenController = async (req, res) => {
  const { refreshToken } = req.body;
  const decode = jwt.verify(refreshToken.tostring(), process.env.JWT_SECRET);
  const user = await userModel.findOne({ where: { id: parseInt(decode.id) } });

  const accessToken = jwt.sign(
    {
      email: user.email,
      password: user.password,
      id: user.id,
    },
    process.env.JWT_SECRET
  );
  return restart.status(200).json({ accessToken });
};

module.exports = getAccessTokenController;
