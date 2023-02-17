const express = require("express");
const { sendEmail } = require("../Controller/email");
const mailRouter = express.Router();
mailRouter.post("/sendMail", sendEmail);
module.exports = mailRouter;
