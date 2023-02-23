const { Sequelize, DataTypes } = require("sequelize");
const { connection } = require("./connectDatabase");

const paymentsModel = connection.define(
  "payments",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardNumber: {
      type: DataTypes.STRING, 
      allowNull: true
    },
    date: {
        type: DataTypes.STRING, 
        allowNull: true
    }, 
    note: {
      type: DataTypes.STRING, 
      allowNull: String
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

module.exports = paymentsModel;
