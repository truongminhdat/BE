 const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateAdminToken = (req, res, next) => {
  const accessToken = req.header("adminToken");
  if (!accessToken)
    return res.status(404).json({
      msg: "User not logged in",
    });
  try {
    const validToken = jwt.verify(adminToken, process.env.JWT_SECRET);
    console.log('check valid Token',validToken)
    console.log('check validToken', validToken)
    req.user = validToken;

    if (validToken) {
      return next();
    }
  } catch (e) {
    return res.status(404).json({
      msg: "auth not token",
    });
  }
};
module.exports = {
    validateAdminToken,
  };
  