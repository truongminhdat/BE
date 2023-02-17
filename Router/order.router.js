const express = require('express');
const {createOrder, getOrder} = require('../Controller/orders/order.controller');
const { validateToken } = require('../middlewares/Authen');
const orderRouter = express.Router();
orderRouter.post('/postorder', validateToken, createOrder);
orderRouter.get('/getorder', validateToken, getOrder )
module.exports = {
    orderRouter
}