import {
  createProduct,
  getProductByCustomer,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByDate,
  getProductByCategoryId,
  getproductbyofferprice,
  getProductByBarCode,
  updateProductPrice,
} from "../services/product.services.js";

export const createProductController = async (req, res, next) => {
  const createProductService = await createProduct(req.body, req.file);
  return res.json(createProductService);
};

export const getProductByCustomerController = async (req, res, next) => {
  const getProductService = await getProductByCustomer(req.body);
  return res.json(getProductService);
};

export const getProductByIdController = async (req, res, next) => {
  const getProductService = await getProductById(req.body);
  return res.json(getProductService);
};

export const updateProductController = async (req, res, next) => {
  const getProductService = await updateProduct(req.body, req.file);
  return res.json(getProductService);
};

export const updateProductPriceController = async (req, res, next) => {
  const getProductService = await updateProductPrice(req.body);
  return res.json(getProductService);
};

export const deleteProductController = async (req, res, next) => {
  const getProductService = await deleteProduct(req.body);
  return res.json(getProductService);
};

export const getProductByDateController = async (req, res, next) => {
  const getProductService = await getProductByDate(req.body);
  return res.json(getProductService);
};

export const getProductByCategoryController = async (req, res, next) => {
  const getProductByCategoryService = await getProductByCategoryId(req.body);
  return res.json(getProductByCategoryService);
};

export const getProductByOfferPriceController = async (req, res) => {
  const getProductByOfferPriceService = await getproductbyofferprice(req.body);
  return res.json(getProductByOfferPriceService);
};

export const getProductByBarcodeController = async (req, res) => {
  const getProductByBarcodeService = await getProductByBarCode(req.body);
  return res.json(getProductByBarcodeService);
};
