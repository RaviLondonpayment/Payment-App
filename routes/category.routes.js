import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryByCustomerController,
  getCategoryByIdController,
  getCountController,
  updateCategoryByIdController,
} from "../controller/category.controllers.js";
import { verifyUser } from "../verification/verification.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/create",
  upload.single("image"),
  verifyUser,
  createCategoryController
);

router.post(
  "/update",
  upload.single("image"),
  verifyUser,
  updateCategoryByIdController
);

router.post("/getbyid", verifyUser, getCategoryByIdController);

router.post("/getbycustomerid", verifyUser, getCategoryByCustomerController);

router.post("/getcount", verifyUser, getCountController);

// router.get("/update")

router.post("/delete", verifyUser, deleteCategoryController);

export { router };
