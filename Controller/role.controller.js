const express = require("express");
const { v4: uuidv4 } = require("uuid");
const RoleModel = require("../models/role.model");

let postRoleController = async (req, res) => {
  try {
    let { name } = req.body;
    if (!name) {
      return res.status(404).json({
        msg: "No enter the value",
      });
    }
    await RoleModel.create({
      id: uuidv4(),
      name,
    });
    return res.status(200).json({
      msg: "Save role model",
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};

let getAllRoleController = async (req, res) => {
  try {
    let getAllRole = await RoleModel.findAll();
    return res.status(200).json({
      msg: "get all role success",
      getAllRole,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};

let updateRoleController = async (req, res) => {
  try {
    let { id } = req.query;
    let { name } = req.body;
    let getRoleId = await RoleModel.findOne({
      where: {
        id: id,
      },
    });

    if (getRoleId) {
      getRoleId.name = name;
      await getRoleId.save();
      return res.status(200).json({
        msg: "Save role success",
        getRoleId,
      });
    } else {
      return res.status(404).json({
        msg: "Save role error",
      });
    }
  } catch (e) {
    return res.status(500).json({
      msg: "Error from the server",
    });
  }
};
module.exports = {
  postRoleController,
  getAllRoleController,
  updateRoleController,
};
