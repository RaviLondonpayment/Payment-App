import express from "express";
import {
  createCategoryController,
  getCategoryByCustomerController,
  getCategoryByIdController,
  getCountController,
  updateCategoryByIdController,
} from "../controller/category.controllers.js";
import { verifyUser } from "../verification/verification.js";

const router = express.Router();

router.post("/create", verifyUser, createCategoryController);

router.post("/update", verifyUser, updateCategoryByIdController);

router.post("/getbyid", verifyUser, getCategoryByIdController);

router.post("/getbycustomerid", verifyUser, getCategoryByCustomerController);

router.post("/getcount", verifyUser, getCountController);

// router.get("/update")

// router.delete("/categories/delete");

export { router };
