const express = require('express');
const {
    createPayment
} = require('../Controller/payment/payment.controller')
const paymentRouter = express.Router();
paymentRouter.post('/createpayment', createPayment);
module.exports = {paymentRouter};
