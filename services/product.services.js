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

//get product by customer
export const getProductByCustomer = async ({ id }) => {
  const products = await productModel.find({ user: id });

  if (products) {
    return {
      success: true,
      status: 200,
      data: products,
    };
  }
};

//get product by id
export const getProductById = async ({ id }) => {
  const products = await productModel.findById({ _id: id });

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

//get product by category
export const getProductByCategoryId = async ({ categoryId }) => {
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
export const updateProduct = async ({ id }) => {
  const products = await productModel.findByIdAndUpdate({ id });
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

//delete product
export const deleteProduct = async ({ id }) => {
  const products = await productModel.deleteOne({ _id: id });
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

//getproductbydate
export const getProductByDate = async ({ id, date }) => {
  const today = new Date().toLocaleDateString("en-GB");

  console.log(date, "date");

  const products = await productModel.find({
    id: id,
    expiryDate: { $gte: today, $lt: date },
  });
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
