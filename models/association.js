const { connection } = require("./connectDatabase");

const { Sequelize, DataTypes } = require("sequelize");
const RoomModel = require("../models/room.model");
const UserModel = require("../models/user.model");
const RoleModel = require("../models/role.model");
const CategoryModel = require("../models/categories");
const GalleryModel = require("../models/galleries");
const OrderModel = require("../models/order");
const OrderDetail = require("../models/orderDetail");
const paymentsModel = require("../models/payment");

const setAssociation = () => {
  RoleModel.hasMany(UserModel, {
    foreignKey: {
      name: "roleId",
      type: DataTypes.STRING,
    },
  });
  UserModel.belongsTo(RoleModel, {
    foreignKey: {
      name: "roleId",
      type: DataTypes.STRING,
    },
  });
  CategoryModel.hasMany(RoomModel, {
    foreignKey: {
      name: "categoryId",
      type: DataTypes.STRING,
    },
  });
  RoomModel.belongsTo(CategoryModel, {
    foreignKey: {
      name: "categoryId",
      type: DataTypes.STRING,
    },
  });
  RoomModel.hasMany(GalleryModel, {
    foreignKey: {
      name: "roomId",
      type: DataTypes.STRING,
    },
  });
  GalleryModel.belongsTo(RoomModel, {
    foreignKey: {
      name: "roomId",
      type: DataTypes.STRING,
    },
  });
  UserModel.hasOne(OrderModel, {
    foreignKey: {
      name: "userId",
      type: DataTypes.STRING,
    },
    onDelete: "cascade",
  });
  OrderModel.belongsTo(UserModel, {
    foreignKey: {
      name: "userId",
      type: DataTypes.STRING,
    },
  });
  OrderModel.hasOne(OrderDetail, {
    foreignKey: {
      name: "orderId",
      type: DataTypes.STRING,
    },
  });
  OrderDetail.belongsTo(OrderModel, {
    foreignKey: {
      name: "orderId",
      type: DataTypes.STRING,
    },
  });
  RoomModel.hasOne(OrderModel,{
    foreignKey:{
      name: "roomId",
      type: DataTypes.STRING
    },onDelete: "cascade",
    });
    OrderModel.belongsTo(RoomModel, {
      foreignKey: {
        name: "roomId",
        type: DataTypes.STRING
      }
    })
    OrderModel.hasMany(paymentsModel, {
      foreignKey:{
        name: "orderId",
        type: DataTypes.STRING
      }
    })
    paymentsModel.belongsTo(OrderModel, {
      foreignKey:{
        name: "orderId", 
        type: DataTypes.STRING
      }
    })
  connection.sync();
 
};

module.exports = setAssociation;
