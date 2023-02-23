const express = require('express');


const {adminLogin, AuthAdminController, countAdminController,adminValidateToken} = require('../Controller/admin.controller');
const { validateAdminToken } = require('../middlewares/AdminAuthen');
const adminRouter = express.Router();


adminRouter.post('/login', adminLogin);
adminRouter.get('/adminAuth',adminValidateToken,AuthAdminController )
adminRouter.get('/adminCount',countAdminController)
module.exports = {
    adminRouter
}