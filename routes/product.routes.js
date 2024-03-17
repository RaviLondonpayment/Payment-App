import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductByBarcodeController,
  getProductByCategoryController,
  getProductByCustomerController,
  getProductByDateController,
  getProductByExpiryDateAndCategoryController,
  getProductByExpiryDateController,
  getProductByIdController,
  getProductByOfferPriceController,
  updateProductController,
  updateProductPriceController,
} from "../controller/product.controllers.js";
import { verifyUser } from "../verification/verification.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/create",
  upload.single("image"),
  verifyUser,
  createProductController
);

router.post(
  "/update",
  upload.single("image"),
  verifyUser,
  updateProductController
);

router.post("/updateprice", updateProductPriceController);

router.post("/getbyid", verifyUser, getProductByIdController);

router.post("/getbycategory", verifyUser, getProductByCategoryController);

router.post("/getbycustomer", verifyUser, getProductByCustomerController);

router.post("/getbydate", verifyUser, getProductByDateController);

router.post("/getbyoffer", verifyUser, getProductByOfferPriceController);

router.post("/getByBarcode", verifyUser, getProductByBarcodeController);

router.post(
  "/getProductByExpiryDate",
  verifyUser,
  getProductByExpiryDateController
);

router.post(
  "/getProductByExpiryDateAndCategory",
  verifyUser,
  getProductByExpiryDateAndCategoryController
);

router.post("/delete", verifyUser, deleteProductController);

export { router };
