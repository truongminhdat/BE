const paymentsModel = require('../../models/payment');
const OrderModel = require('../../models/order');
const { v4: uuidv4 } = require("uuid");


const createPayment = async(req, res) => {

    const { name, cardNumber, date, note,orderId} = req.body;
  
    if(!name || !cardNumber || !date || !note){
        return res.status(404).json({
            msg: "No data found"
        })
    }

    else {
      let data =  await paymentsModel.create({
        id: uuidv4(),
        name, cardNumber, date, note, orderId
       });
       if(data){
         const order = await OrderModel.findOne({
            where: {
               id: data.orderId
            }
         })
         order.status = 1;
         await order.save(); 
         return res.status(200).json({
           msg:'Update Status Order!'});
       }
      
       return res.status(200).json({
        msg: "Create payment success!",
        data
       })
    }
    
  }

module.exports = {
    createPayment
}