import productModel from "../models/product.model.js";

//create product
export const createProduct = async (payload) => {
  const product = new productModel();
  await product.save(payload);

  return { success: true, message: "Product created successfully" };
};

//getall products
export const getAllProduct = async () => {
  const products = await productModel.find();

  return {
    success: true,
    status: 200,
    data: products,
  };
};

//get product by id
export const getProductById = async (id) => {
  const products = await productModel.findById({ _id: id });

  return {
    success: true,
    status: 200,
    data: products,
  };
};

//get product by category
export const getProductByCategoryId = async (categoryId) => {
  const products = await productModel.findOne({ category: categoryId });

  if (products) {
    return {
      success: true,
      status: 200,
      data: products,
    };
  } else {
    return {
      success: false,
      status: 404,
      message: "Product unavailable",
    };
  }
};

//update product
export const updateProduct = async (payload) => {
  const products = await productModel.findByIdAndUpdate({ payload });
  if (product) {
    return {
      success: true,
      status: 200,
      data: products,
    };
  } else {
    return {
      success: false,
      status: 404,
      message: "Product unavailable",
    };
  }
};

//delete product
export const deleteProduct = async (id) => {
  const products = await productModel.deleteOne({ _id: id });
  if (product) {
    return {
      success: true,
      status: 200,
      data: products,
    };
  } else {
    return {
      success: false,
      status: 404,
      message: "Product unavailable",
    };
  }
};
