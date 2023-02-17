// const express = require("express");
// const HotelModel = require("../models/roomType.model");
// const { v4: uuidv4 } = require("uuid");
// var path = require("path");
// var fs = require("fs");

let createHotelController = async (req, res) => {
  let { name, type, city, address, distance, title, desc, cheaperPrice } =
    req.body;
  if (req.files === null) {
    return res.status(400).json({
      msg: "No files upload",
    });
  }
  const { file } = req.files;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];
  if (!allowedType.includes(ext.toLowerCase())) {
    return res.status(422).json({
      msg: "Invalid Images",
    });
  }
  if (fileSize > 5000000) {
    return res.status(422).json({
      msg: "Image must be lest than 5MB",
    });
  }
  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err)
      return res.status(500).json({
        msg: "Not image ",
      });
    try {
      let createHotel = await HotelModel.create({
        id: uuidv4(),
        name,
        type,
        city,
        address,
        photos: fileName,
        url: url,
        distance,
        title,
        desc,
        cheaperPrice,
      });
      return res.status(200).json({
        msg: "Create success full",
        createHotel,
      });
    } catch (error) {
      return res.status(404).json({
        msg: "Create success failed",
      });
    }
  });
};
let updateHotelController = async (req, res) => {
  try {
    let { id } = req.query;
    let { name, type, city, address, distance, title, desc, cheaperPrice } =
      req.body;
    let hotel = await HotelModel.findOne({
      where: {
        id: id,
      },
    });
    if (!hotel) {
      return res.status(404).json({
        msg: "No Data Found!",
      });
    }
    let fileName = "";
    if (req.files === null) {
      fileName = HotelModel.photos;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({
          msg: "Invalid Images",
        });
      }
      if (fileSize > 5000000) {
        return res.status(422).json({
          msg: "Image must be lest than 5MB",
        });
      }
      const filepath = `./public/images/${hotel.photos}`;
      fs.unlinkSync(filepath);
      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err)
          return res.status(500).json({
            msg: "Not image ",
          });
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        try {
          await HotelModel.update(
            {
              name,
              type,
              city,
              address,
              photos: fileName,
              url: url,
              distance,
              title,
              desc,
              cheaperPrice,
            },
            {
              where: {
                id: id,
              },
            }
          );
          return res.status(200).json({
            msg: "Update hotel success",
          });
        } catch (e) {
          return res.status(404).json({
            msg: "Update hotel failed",
          });
        }
      });
    }

    // if (hotel) {
    //   (hotel.name = name),
    //     (hotel.type = type),
    //     (hotel.city = city),
    //     (hotel.address = address),
    //     (hotel.distance = distance),
    //     (hotel.title = title),
    //     (hotel.desc = desc),
    //     (hotel.cheaperPrice = cheaperPrice),
    //     await hotel.save();
    //   return res.status(200).json({
    //     msg: "Update hotels success",
    //   });
    // } else {
    //   return res.status(404).json({
    //     msg: "Update hotels ",
    //   });
    // }
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};
let getAllHotelController = async (req, res) => {
  try {
    let hotels = await HotelModel.findAll();
    return res.status(200).json({
      msg: "Get All Hotel Success",
      hotels,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};
let getLimitHotel = async (req, res) => {
  const { featured } = req.query;
  let limitNumber = parseInt(req.query.limit);
  const hotels = await HotelModel.findAll({
    where: {
      featured: featured,
    },
    limit: limitNumber,
  });
  return res.status(200).json({
    hotels,
  });
};
let getDestinationHotel = async (req, res) => {
  try {
    let { city } = req.query;
    let getHotel = await HotelModel.findAll({
      where: {
        city: city,
      },
    });
    return res.status(200).json({
      msg: "get all user",
      getHotel,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};
let deleteHotelController = async (req, res) => {
  let { hotelId } = req.query;
  let hotel = await HotelModel.findOne({
    where: {
      id: hotelId,
    },
  });
  if (!hotel) {
    return res.status(404).json({
      msg: "No data found",
    });
  }
  try {
    const filepath = `./public/images/${hotel.photos}`;
    fs.unlinkSync(filepath);
    await HotelModel.destroy({
      where: {
        id: hotelId,
      },
    });
    return res.status(200).json({
      msg: "Delete hotel success!",
    });
  } catch (e) {}
};
let countByType = async (req, res) => {
  try {
    let hotelCount = await HotelModel.count({
      where: {
        type: "Resort",
      },
    });
    let appermentCount = await HotelModel.count({
      where: {
        type: "appertment",
      },
    });
    let villaCount = await HotelModel.count({
      where: {
        type: "villa",
      },
    });
    let resortCount = await HotelModel.count({
      where: {
        type: "resort",
      },
    });
    return res.status(200).json([
      {
        type: "hotel",
        count: hotelCount,
      },
      {
        type: "appertment",
        count: appermentCount,
      },
      {
        type: "villa",
        count: villaCount,
      },
      {
        type: "resort",
        count: resortCount,
      },
    ]);
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};
let searchHotel = (req, res) => {
  try {
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};
module.exports = {
  createHotelController,
  updateHotelController,
  getAllHotelController,
  deleteHotelController,
  countByType,
  getLimitHotel,
  getDestinationHotel,
};
