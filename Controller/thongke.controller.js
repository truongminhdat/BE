const UserModel = require('../models/user.model')
const { QueryTypes } = require('sequelize');
let thongkeController = async (req, res) => {
     const data = await UserModel.count({
      group: ["gender"]
     })
     return res.status(200).json({
      data
     })
    
}
module.exports = {
    thongkeController
}