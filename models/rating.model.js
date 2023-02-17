const { Sequelize, DataTypes } = require("sequelize");
const { connection } = require("./connectDatabase");

const RatingModel = connection.define(
  "rating",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.STRING,
      validate: {
        min: 0,
        max: 5,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = RatingModel;
