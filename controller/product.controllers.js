import {
  createProduct,
  getProductByCustomer,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByDate,
  getProductByCategoryId,
} from "../services/product.services.js";

export const createProductController = async (req, res, next) => {
  const createProductService = await createProduct(req);
  return res.json(createProductService);
};

export const getProductByCustomerController = async (req, res, next) => {
  const getProductService = await getProductByCustomer(req);
  return res.json(getProductService);
};

export const getProductByIdController = async (req, res, next) => {
  const getProductService = await getProductById(req);
  return res.json(getProductService);
};

export const updateProductController = async (req, res, next) => {
  const getProductService = await updateProduct(req);
  return res.json(getProductService);
};

export const deleteProductController = async (req, res, next) => {
  const getProductService = await deleteProduct(req);
  return res.json(getProductService);
};

export const getProductByDateController = async (req, res, next) => {
  const getProductService = await getProductByDate(req);
  return res.json(getProductService);
};

export const getProductByCategoryController = async (req, res, next) => {
  const getProductByCategoryService = await getProductByCategoryId(req);
  return res.json(getProductByCategoryService);
};
