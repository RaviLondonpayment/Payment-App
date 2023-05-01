import {
  createCategory,
  getCategoryByCustomer,
  getCategoryById,
} from "../services/category.services.js";

export const createCategoryController = async (req, res) => {
  const createCategoryService = await createCategory(req.body, res);
  return res.json(createCategoryService);
};

export const getCategoryByCustomerController = async (req, res) => {
  const getCategorBycustomerService = await getCategoryByCustomer(
    res.locals.user
  );
  return res.json(getCategorBycustomerService);
};

export const getCategoryByIdController = async (req, res) => {
  const getCategoryByIdService = await getCategoryById(req);
  return res.json(getCategoryByIdService);
};

export const updateCategoryByIdController = async (req, res) => {
  const updateCategoryByIdService = await updateCategoryById(req);
  return res.json(updateCategoryByIdService);
};
