const { Sequelize } = require("sequelize");
require("dotenv").config();

const DATABASE_NAME = process.env.DATABASE_NAME;
const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;
const DIALECT = process.env.DIALECT;

const connection = new Sequelize(DATABASE_NAME, USER_NAME, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
});

module.exports = { connection };
