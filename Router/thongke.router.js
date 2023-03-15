const express = require('express');
const  thongkeRouter = express.Router();
const { thongkeController} = require('../Controller/thongke.controller');
thongkeRouter.get('/getThongke',thongkeController)
module.exports = {
    thongkeRouter
}
