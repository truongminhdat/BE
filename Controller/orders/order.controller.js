const OrderModel = require('../../models/order');
const { v4: uuidv4 } = require("uuid");
const RoomModel = require('../../models/room.model');

const createOrder = async(req, res) => {
    

    const  {id, quantity} = req.body;
  
 
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
             quantity,         
    
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
              attributes: ["url","title", "price"],
            },
          ],
          raw: true,
          nest: true,
    });
    let count = await OrderModel.count({
        where: {
            userId: req.user.id
        }
    });
    return res.status(200).json({
        msg:"Get All Room",
        data, 
        count
    })
} 
const deleteorder = async(req, res) => {
    try {

        let data = await OrderModel.destroy({
            where: {
                userId: req.user.id
            }
        })
        return res.status(200).json({
            msg: "Delete sucess", data
        })
        
    } catch (e) {
        return res.status(500).json({
            msg: 'Error from the server'
        })
    }
}  

       
        

    
module.exports = {
    createOrder,getOrder, deleteorder}