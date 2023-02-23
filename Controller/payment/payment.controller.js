const paymentsModel = require('../../models/payment');
const { v4: uuidv4 } = require("uuid");


const createPayment = async(req, res) => {

    const { name, cardNumber, date, note, orderId } = req.body;
    // const {id } = req.query;
    // const order = await OrderModel.findOne({
    //     where: {
    //         roomId: id
    //     }
    // })
    if(!name || !cardNumber || !date || !note){
        return res.status(404).json({
            msg: "No data found"
        })
    }

    else {
       await paymentsModel.create({
        id: uuidv4(),
        name, cardNumber, date, note, orderId
       })
       return res.status(200).json({
        msg: "Create payment success!"
       })
    }
    
  }

module.exports = {
    createPayment
}