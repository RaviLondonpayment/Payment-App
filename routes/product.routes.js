import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductByCategoryController,
  getProductByCustomerController,
  getProductByDateController,
  getProductByIdController,
  updateProductController,
} from "../controller/product.controllers.js";

const router = express.Router();

router.post("/create", createProductController);

router.get("/update", updateProductController);

router.get("/getbyid", getProductByIdController);

router.get("/getbycategoryid", getProductByCategoryController);

router.get("/getproductbycustomer", getProductByCustomerController);

router.get("/getbydate", getProductByDateController);

router.delete("/delete", deleteProductController);

export { router };
