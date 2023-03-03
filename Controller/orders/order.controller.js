const OrderModel = require('../../models/order');
const { v4: uuidv4 } = require("uuid");
const RoomModel = require('../../models/room.model');
const UserModel = require('../../models/user.model');
const nodemailer = require('nodemailer');

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
const getOrderAdmin = async(req, res) => {
    try {
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
        return res.status(200).json({
            msg: "Get admin orders", data
        })
        
    } catch (e) {
        return res.status(500).json({
            msg: "Error from the server"
        })
        
    }
}
const getAllOrder = async(req, res) =>{
    let data =  await OrderModel.findAll({
        include: [
            {
              model: RoomModel,
              as: "room",
              attributes: ["url","title", "price", "discount"],
            },
            {
                model: UserModel,
                as: 'user',
            }
          ],
        
          raw: true,
          nest: true,
    });
   
    return res.status(200).json({
        msg:"Get All Room",
        data, 
    })
}

const sendMail = async (req, res) => {
    try {
        
        const {email} = req.body;
        console.log('email', email)
  const data = await UserModel.findOne({
    where:{
      email: email
    },
    raw:true,
  })
  console.log('check data', data)
  
  if(!data){
    return res.json('User not exits !')
  }
 
  
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'truongminhdat789@gmail.com' ,// generated ethereal user
      pass: 'wgeavuzahijohagg', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'Booking Room', // sender address
    to: data.email, // list of receivers
    subject: "Thông báo đặt phòng thành công", // Subject line
    text: 'Thông báo đặt phòng thành công',
    html: `Thông báo khách hàng ${data.username} đặt phòng thành công!`// plain text body
  });

        
    } catch (e) {
        return res.status(500).json({
            msg: "Error from the server"
        })
    }
}
        

const getOneOrder = async(req, res) => {
    let getByIdOrder = await OrderModel.findOne({
        where: {
            id: req.query.id,
        },
        include: [
            {
              model: RoomModel,
              as: "room",
              attributes: ["url","title", "price", "discount"],
            },
            {
                model: UserModel,
                as: 'user',
            }
          ],
        
          raw: true,
          nest: true,
    })
    return res.status(200).json({
    msg: "Get one order by id", getByIdOrder   })
}
       
        

    
module.exports = {
    createOrder,getOrder, deleteorder, getOrderAdmin, getAllOrder, sendMail, getOneOrder
}