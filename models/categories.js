const { Sequelize, DataTypes } = require("sequelize");
const { connection } = require("./connectDatabase");

const CategoryModel = connection.define(
  "categories",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = CategoryModel;
