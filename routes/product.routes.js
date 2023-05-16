import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductByBarcodeController,
  getProductByCategoryController,
  getProductByCustomerController,
  getProductByDateController,
  getProductByIdController,
  getProductByOfferPriceController,
  updateProductController,
} from "../controller/product.controllers.js";
import { verifyUser } from "../verification/verification.js";

const router = express.Router();

router.post("/create", verifyUser, createProductController);

router.post("/update", verifyUser, updateProductController);

router.post("/getbyid", verifyUser, getProductByIdController);

router.post("/getbycategory", verifyUser, getProductByCategoryController);

router.post("/getbycustomer", verifyUser, getProductByCustomerController);

router.post("/getbydate", verifyUser, getProductByDateController);

router.post("/getbyoffer", verifyUser, getProductByOfferPriceController);

router.post("/getByBarcode", verifyUser, getProductByBarcodeController);

router.delete("/delete", verifyUser, deleteProductController);

export { router };
