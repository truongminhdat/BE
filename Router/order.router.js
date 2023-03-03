const express = require('express');
const {createOrder, getOrder, deleteorder, getAllOrder, sendMail, getOneOrder} = require('../Controller/orders/order.controller');
const { validateToken } = require('../middlewares/Authen');
const orderRouter = express.Router();
orderRouter.post('/postorder', validateToken, createOrder);
orderRouter.get('/getorder', validateToken, getOrder )
orderRouter.delete('/deleteorder', validateToken, deleteorder ),
orderRouter.get('/getallorder', getAllOrder)
orderRouter.post('/sendmail', sendMail);
orderRouter.get('/getByIdOrder', getOneOrder)

module.exports = {
    orderRouter
}