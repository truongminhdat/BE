const express = require("express");

const {
  postRoleController,
  getAllRoleController,
} = require("../Controller/role.controller");

const roleRouter = express.Router();

roleRouter.post("/createRole", postRoleController);
roleRouter.get("/getAllRole", getAllRoleController);

module.exports = {roleRouter};
