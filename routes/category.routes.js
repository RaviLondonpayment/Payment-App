import express from "express";
import {
  createCategoryController,
  getCategoryByCustomerController,
  getCategoryByIdController,
  updateCategoryByIdController,
} from "../controller/category.controllers.js";

const router = express.Router();

router.post("/create", createCategoryController);

router.get("/update", updateCategoryByIdController);

router.post("/getbyid", getCategoryByIdController);

router.post("/getbycustomerid", getCategoryByCustomerController);

// router.get("/update")

// router.delete("/categories/delete");

export { router };
