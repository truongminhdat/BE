const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken)
    return res.status(404).json({
      msg: "User not logged in",
    });
  try {
    const validToken = jwt.verify(accessToken, process.env.JWT_SECRET);
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
  validateToken,
};
