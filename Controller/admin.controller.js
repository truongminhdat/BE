const express = require("express");
const jwt = require("jsonwebtoken");
const route = express.Router();
const UserModel = require("../models/user.model");
const RoleModel = require("../models/role.model")
const roles = require("../models/role.model");
const RoomModel = require("../models/room.model");
const OrderModel = require("../models/order");
const CategoryModel = require("../models/categories");
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
    include: [
      {
        model: RoleModel,
        as: "role",
        attributes: ["name"],
      },
    ],
    raw: true,
    nest: true

  });
  if(admin.role.name === 'User'){
    return res.status(404).json({
      msg: "Account does not have permission to login"
    })
  }



  if (!admin) {
    return res.status(404).json({ msg: "Account not found" });
  }

  if (admin) {
    const adminToken = jwt.sign(
      JSON.stringify({ email: admin.email, id: admin.id }),
      process.env.JWT_SECRET
    );

    const refreshToken = jwt.sign(
      JSON.stringify({
        id: admin.id,
      }),
      process.env.JWT_SECRET
    );

    return res
      .status(200)
      .json({ msg: "login successfully", adminToken, refreshToken });
  }
  return res.status(400).json({ msg: "Data is not valid" });
};
const AuthAdminController = (req, res) => {
  return res.json(req.user);
}; 
const adminValidateToken = (req, res, next) => {
  const adminToken = req.header("adminToken");
  if (!adminToken)
    return res.status(404).json({
      msg: "User not logged in",
    });
  try {
    const validToken = jwt.verify(adminToken, process.env.JWT_SECRET);
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

const countAdminController  =async(req, res) => {

    let room = await OrderModel.count({
     where:{
      status: 1
     }
    })
    let user = await UserModel.count()
    let role = await RoleModel.count()
    let categories = await CategoryModel.count()

    return res.status(200).json({
      msg: "Count room data", 
      room,
      user,
      role, 
      categories

    })
  }
    


module.exports = {
  registerController,
  adminLogin,
  AuthAdminController,
  countAdminController, 
  adminValidateToken
};
