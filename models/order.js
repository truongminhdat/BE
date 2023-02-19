const { Sequelize, DataTypes } = require("sequelize");
const { connection } = require("./connectDatabase");

const OrderModel = connection.define(
  "orders",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.STRING, 
      defaultValue: 1,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue:0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = OrderModel;
