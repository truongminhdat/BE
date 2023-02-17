const express = require("express");
const jwt = require("jsonwebtoken");
const route = express.Router();
const UserModel = require("../models/user.model");
const roles = require("../models/role.model");
require("dotenv").config();

const registerController = async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      selectedDate,
      gender,
      password,
    } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    const { file } = req.files;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({
        msg: "Invalid Images",
      });
    }
    if (fileSize > 5000000) {
      return res.status(422).json({
        msg: "Image must be lest than 5MB",
      });
    }
    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err)
        return res.status(500).json({
          msg: "Not image ",
        });
      try {
        await UserModel.create({
          id: uuidv4(),
          username,
          firstName,
          lastName,
          password: hash,
          email,
          address,
          phoneNumber,
          dayOfBirth: selectedDate,
          gender,
          role: "admin",
          avatar: fileName,
          url: url,
        });
        return res.status(200).json({
          msg: "create user success",
        });
      } catch (e) {
        return res.status(404).json({
          msg: "User is not error",
        });
      }
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Error from server",
    });
  }
};

const adminLogin = async (req, res) => {
  const { email: inputEmail, password: pwd } = req.body;
  if (!inputEmail || !pwd) {
    return res.status(400).json({ msg: "insert email or password" });
  }

  const admin = await UserModel.findOne({
    where: {
      email: inputEmail,
    },
    raw: true,
  });
  console.log("check admin", admin);

  if (!admin) {
    return res.status(404).json({ msg: "Account not found" });
  }

  if (admin) {
    const accessToken = jwt.sign(
      JSON.stringify({ email: admin.email, id: admin.id }),
      process.env.JWT_SECRET
    );

    const refreshToken = jwt.sign(
      JSON.stringify({
        id: admin.id,
      }),
      process.env.JWT_SECRET
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ msg: "login successfully", accessToken, refreshToken });
  }
  return res.status(400).json({ msg: "Data is not valid" });
};

module.exports = {
  registerController,
  adminLogin,
};
