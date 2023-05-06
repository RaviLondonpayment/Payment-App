import mongoose from "mongoose";
import productModel from "../models/product.model.js";

//create product
export const createProduct = async ({
  user,
  categoryid,
  productName,
  image,
  quantity,
  kilogram,
  price,
  manufacturingDate,
  expiryDate,
  description,
  offer,
}) => {
  let userid = mongoose.Types.ObjectId(user);
  let category = mongoose.Types.ObjectId(categoryid);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  console.log(today, "date");
  const product = new productModel({
    productName: productName,
    category: category,
    quantity: quantity,
    image: image,
    manufacturingDate: manufacturingDate,
    kilogram: kilogram,
    price: price,
    expiryDate: expiryDate,
    user: userid,
    description: description,
    offer: offer,
  });
  await product.save();
  if (product) {
    return { success: true, message: "Product created successfully" };
  } else {
    return { success: false, message: "Product creation failed" };
  }
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
export const getProductByCustomer = async ({ user }) => {
  let userid = mongoose.Types.ObjectId(user);
  console.log(user, userid);
  const products = await productModel.find({ user: userid });

  if (products) {
    return {
      success: true,
      status: 200,
      data: products,
    };
  } else {
    return {
      success: false,
      status: 400,
      message: "No data",
    };
  }
};

//get product by id
export const getProductById = async ({ id }) => {
  let user = mongoose.Types.ObjectId(id);
  const products = await productModel.findById({ _id: user });

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
export const getProductByCategoryId = async ({ category }) => {
  console.log("category", category);
  let categoryid = mongoose.Types.ObjectId(category);
  const products = await productModel.find({ category: categoryid });

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
      message: "Product unavailable in this category",
    };
  }
};

//update product
export const updateProduct = async ({
  id,
  name,
  category,
  user,
  quantity,
  image,
  manufacturingDate,
  kilogram,
  price,
  expiryDate,
  description,
}) => {
  let productid = mongoose.Types.ObjectId(id);
  let categoryid = mongoose.Types.ObjectId(category);
  let userid = mongoose.Types.ObjectId(user);
  const products = await productModel.findByIdAndUpdate(
    { _id: productid },
    {
      productName: name,
      categoryid: categoryid,
      quantity: quantity,
      image: image,
      manufacturingDate: manufacturingDate,
      kilogram: kilogram,
      price: price,
      expiryDate: expiryDate,
      user: userid,
      description: description,
    }
  );
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
  let productid = mongoose.Types.ObjectId(id);
  const products = await productModel.deleteOne({ _id: productid });
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
  let productid = mongoose.Types.ObjectId(id);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  console.log(date, "date");

  const products = await productModel.find({
    id: productid,
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
