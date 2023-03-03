const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const RoomModel = require("../models/room.model");
const saltRounds = 10;
require("dotenv").config();
var path = require("path");
const RoleModel = require("../models/role.model");
const { Op } = require("sequelize");
const fs = require("fs");
const { simpleEmail } = require("./mail.controller");
const { send } = require("process");
const nodemailer = require('nodemailer');


const registrationController = async (req, res) => {
  // try {
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
        roleId: "ccd81d90-067c-4518-9f66-163e7da31a3b",
        avatar: fileName,
        url: url,
      });
      return res.status(200).json({
        msg: "create user success",
      });
    
  });
};

const loginController = async (req, res) => {
  const { email: inputEmail, password: pwd } = req.body;
  if (!inputEmail || !pwd) {
    return res.status(400).json({
      msg: "Please insert email or password",
    });
  }

  const user = await UserModel.findOne({
    where: {
      email: inputEmail,
    },
    raw: true,
  });
  if (!user) {
    return res.status(404).json({
      msg: "User not found",
    });
  }
  const isPassword = await bcrypt.compare(pwd, user.password);

  if (!isPassword) {
    return res.status(400).json({
      msg: "Wrong password or username",
    });
  }
  if (user) {
    const accessToken = jwt.sign(
      JSON.stringify({
        email: user.email,
        id: user.id,
        url: user.url,
        address: user.address,
      }),
      process.env.JWT_SECRET
    );

    const refreshToken = jwt.sign(
      JSON.stringify({
        id: user.id,
      }),
      process.env.JWT_SECRET
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      msg: "login successfully!",
      accessToken,
      refreshToken,
    });
  }
  return res.status(400).json({ msg: "data is not valid!" });
};

const resetPasswordController = async (req, res) => {
  try {
    const checkToken = jwt.verify(
      req.headers.accesstoken,
      process.env.JWT_SECRET
    );
    const user = await UserModel.findByPk({
      where: {
        email: checkToken.email,
      },
    });
    if (user) {
      const { newPassword } = req.body;
      const encrypted = md5(newPassword);
      user.password = encrypted;
      await user.save();
      return res.status(200).json({
        msg: "password reset successfully.",
      });
    } else {
      return res.status(400).json({
        msg: "password reset failed",
      });
    }
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};

const editUser = async (req, res) => {
  const user = await UserModel.findOne({
    where: {
      id: req.query.id,
    },
    raw: true,
  });

  if (!user) return res.status(404).json({ msg: "No user found" });

  let fileName = "";
  if (req.files === null) {
    fileName = user.avatar;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filepath = `./public/images/${user.avatar}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const {
    username,
    firstname,
    lastname,
    email,
    address,
    phonenumber,
    selectedDate,
    gender,
  } = req.body;

  await UserModel.update(
    {
      username: username,
      firstName: firstname,
      lastName: lastname,
      email: email,
      address: address,
      phoneNumber: phonenumber,
      dayOfBirth: selectedDate,
      gender: gender,
      avatar: fileName,
      url: url,
    },
    {
      where: {
        id: req.query.id,
      },
    }
  );
  res.status(200).json({ msg: "User updated successfully" });
  // } catch (error) {
  //   console.log(error.message);
  //   return res.status(500).json({
  //     msg: "Error from the server",
  //   });
  // }
};

const updateProfileController = async (req, res) => {
  const checkToken = jwt.verify(
    req.headers.accesstoken,
    process.env.JWT_SECRET
  );
  const user = await UserModel.findOne({
    where: {
      id: checkToken.id,
    },
    raw: true,
  });

  if (!user) return res.status(404).json({ msg: "No user found" });

  let fileName = "";
  if (req.files === null) {
    fileName = user.photos;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filepath = `./public/images/${user.photos}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const {
    username,
    firstname,
    lastname,
    email,
    address,
    phonenumber,
    selectedDate,
    gender,
    avatar,
  } = req.body;
  try {
    await UserModel.update(
      {
        username: username,
        firstName: firstname,
        lastName: lastname,
        email: email,
        address: address,
        phoneNumber: phonenumber,
        dayOfBirth: selectedDate,
        gender: gender,
        avatar: fileName,
        url: url,
      },
      {
        where: {
          id: req.query.id,
        },
      }
    );
    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};

const getAllUser = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offset = limit * page;
  const search = req.query.search;
  const totalRows = await UserModel.count({
    where: {
      [Op.or]: [
        {
          username: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          email: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  let getAllUser = await UserModel.findAll({
    where: {
      [Op.or]: [
        {
          username: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          email: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          gender: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
    include: [
      {
        model: RoleModel,
        as: "role",
        attributes: ["name"],
      },
    ],
    raw: true,
    nest: true,
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });
  // console.log("check user hello word", getAllUser);
  return res.status(200).json({
    msg: "get all user",
    getAllUser,
    page,
    limit,
    totalRows,
    totalPage,
  });
  // } catch (e) {
  //   return res.status(500).json({
  //     msg: "Error from the server",
  //   });
  // }
};
const getAllUserById = async (req, res) => {
  try {
    let { userId } = req.query;
    let user = await UserModel.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: RoleModel,
          as: "role",
          attributes: ["name"],
        },
      ],
      raw: true,
      nest: true,
    });
    if (user) {
      return res.status(200).json({
        msg: "get user by id",
        user,
      });
    } else {
      return res.status(404).json({
        msg: "get user error",
      });
    }
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.query.id;
    await UserModel.destroy({ where: { id: userId } });
    return res.status(200).json({
      msg: "Delete user success",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};

const createUser = async (req, res) => {
  const {
    username,
    password,
    firstName,
    lastName,
    email,
    address,
    phoneNumber,
    selectedDate,
    gender,
    roleId,
  } = req.body;

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

    if (
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !email ||
      !address ||
      !phoneNumber ||
      !selectedDate ||
      !gender ||
      !roleId
    ) {
   
      return res.status(404).json({ msg: "Please insert values" });
    } else {
      await UserModel.create({
        id: uuidv4(),
        username,
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        dayOfBirth: selectedDate,
        gender,
        roleId,
        avatar: fileName,
        url: url,
      });

      // console.log("check user", user);
      return res.status(200).json({
        msg: "create user success",
      });
    }
    // } catch (error) {
    //   res.status(500).json({ msg: "create user error", error });
    // }
  });
};

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.email = decoded.email;
      next();
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Error from server",
    });
  }
};
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      msg: "No token",
    });
  }
  const checktoken = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const user = await UserModel.findAll({
    where: {
      id: checktoken.id,
    },
  });
  if (!user) {
    return res.status(404).json({
      msg: "User refresh token is error",
    });
  }
  const userId = user.id;
  const userName = user.username;
  const email = user.email;
  const accessToken = jwt.sign(
    { userId, userName, email },
    process.env.JWT_SECRET,
    {
      expiresIn: "15s",
    }
  );
  return res.status(200).json({
    accessToken,
  });
};
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ["id", "username", "email"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};
const Authcontroller = (req, res) => {
  return res.json(req.user);
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      msg: "Please provide a vilid email!",
    });
  }
  const user = await UserModel.findOne({
    email,
  });
  if (!user) {
    return res.status(404).json({
      msg: "User not found, invalid request",
    });
  } else {
    await sendEmail({
      email,
    });
    return res.status(200).json({
      msg: "Send mail success",
    });
  }
};
const resetPassword = async(req, res) => {
  const {email} = req.body;
  const password = '123456789'
  const data = await UserModel.findOne({
    where:{
      email: email
    },
    raw:true,
  })
  console.log('check password', data.password)
  if(!data){
    return res.json('User not exits !')
  }
 
  const encryptedPassword = await bcrypt.hash('123456789', 10);
  data.password = encryptedPassword;
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'truongminhdat789@gmail.com' ,// generated ethereal user
      pass: 'wgeavuzahijohagg', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'Booking Room', // sender address
    to: data.email, // list of receivers
    subject: "Đặt lại mật khẩu", // Subject line
    text: 'Đặt lại mật khẩu',
    html: `Hệ thống Booking Hotel cấp lại cho bạn là ${password}`// plain text body
  });

  return res.status(200).json({
    msg: "Create user password"
  })

}
const updatePassword = async(req, res) => {
  try {
    const {id, token } = req.params;
    const {password} = req.params; 
    const oldUser = await UserModel.findOne({id: id});
    if(!oldUser){
      return res.status(400).json({
        msg: "User not exits!"
      })
    }
    const secret = process.env.JWT_SECRET + oldUser.password; 
   
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      oldUser.password = encryptedPassword; 
      return res.status(200).json({
        msg: "Update password success"
      })
  
     
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server"
    })    
  }
}

module.exports = {
  registrationController,
  loginController,
  resetPasswordController,
  updateProfileController,
  getAllUser,
  getAllUserById,
  deleteUser,
  createUser,
  verifyToken,
  refreshToken,
  getUsers,
  Authcontroller,
  forgotPassword,
  editUser,
  resetPassword, 
  updatePassword
};
