const express = require('express');
const {createOrder, getOrder, deleteorder} = require('../Controller/orders/order.controller');
const { validateToken } = require('../middlewares/Authen');
const orderRouter = express.Router();
orderRouter.post('/postorder', validateToken, createOrder);
orderRouter.get('/getorder', validateToken, getOrder )
orderRouter.delete('/deleteorder', validateToken, deleteorder ),

module.exports = {
    orderRouter
}