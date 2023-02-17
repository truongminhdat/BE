const { Sequelize, DataTypes } = require("sequelize");
const { connection } = require("./connectDatabase");

const OrderDetailModel = connection.define(
  "order_details",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = OrderDetailModel;
