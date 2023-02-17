const { Sequelize, DataTypes } = require("sequelize");
const { connection } = require("./connectDatabase");

const GalleryModel = connection.define(
  "galleries",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = GalleryModel;
