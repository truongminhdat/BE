const express = require("express");
const {
  createCategories,
  getAllCategories,
  getCategoriesData,
  deleteCategory,
  editCategory,
} = require("../Controller/categories/categories.controller");
const categoriesRouter = express.Router();

categoriesRouter.post("/createCategories", createCategories);
categoriesRouter.get("/getAllCategories", getAllCategories);
categoriesRouter.get("/getCategoriesData", getCategoriesData);
categoriesRouter.delete("/deleteCategory", deleteCategory);
categoriesRouter.put("/editCategory", editCategory);

module.exports = categoriesRouter;
