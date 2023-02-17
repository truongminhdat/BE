const OrderModel = require('../../models/order');
const { v4: uuidv4 } = require("uuid");
const RoomModel = require('../../models/room.model');

const createOrder = async(req, res) => {
    const userId = req.user.id;

    const  {id} = req.body;
  
    const address = req.user.address;
    const order = await OrderModel.findOne({
        where: {
            roomId: id
        }
    })
    if(order){
        return res.status(404).json({
            msg: "Bạn đã đặt phòng này rồi"
        })
    }
    else{
        let data =  await OrderModel.create({
            id: uuidv4(),
            userId: req.user.id, 
             roomId: id,
             address: req.user.address,               
    
        })
        return res.status(200).json({
            msg: "Đặt Phòng Thành Công",
            data
        })
    }

    }
const getOrder = async(req, res) =>{

    let data =  await OrderModel.findAll({
        where: {
            userId: req.user.id
        }, 
        include: [
            {
              model: RoomModel,
              as: "room",
              attributes: ["url","title"],
            },
          ],
          raw: true,
          nest: true,
    });
    return res.status(200).json({
        msg:"Get All Room",
        data
    })
} 

  

       
        

    
module.exports = {
    createOrder,getOrder}