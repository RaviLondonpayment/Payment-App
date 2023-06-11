import {
  createCategory,
  deleteCategory,
  getCategoryByCustomer,
  getCategoryById,
  getCount,
  updateCategory,
} from "../services/category.services.js";

export const createCategoryController = async (req, res) => {
  const createCategoryService = await createCategory(req.body, req.file);
  return res.json(createCategoryService);
};

export const getCategoryByCustomerController = async (req, res) => {
  const getCategorBycustomerService = await getCategoryByCustomer(req.body);
  return res.json(getCategorBycustomerService);
};

export const getCategoryByIdController = async (req, res) => {
  const getCategoryByIdService = await getCategoryById(req.body);
  // console.log(getCategoryByIdService);
  return res.json(getCategoryByIdService);
};

export const updateCategoryByIdController = async (req, res) => {
  const updateCategoryByIdService = await updateCategory(req.body, req.file);
  return res.json(updateCategoryByIdService);
};

export const getCountController = async (req, res) => {
  const getCountService = await getCount(req.body);
  return res.json(getCountService);
};

export const deleteCategoryController = async (req, res) => {
  const deleteCategoryService = await deleteCategory(req.body);
  return res.json(deleteCategoryService);
};
