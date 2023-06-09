import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import { createCanvas } from "canvas";
import crypto from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../libraries/bucket.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

// import JsBarcode from "jsbarcode";
//calculation
const calculation = (offer, price) => {
  return price - (price * offer) / 100;
};

//create product
export const createProduct = async (
  {
    user,
    categoryid,
    productName,
    quantity,
    kilogram,
    price,
    manufacturingDate,
    expiryDate,
    description,
    offer,
    barCode,
  },
  file
) => {
  let uniqueName = "";
  if (file && file.buffer) {
    uniqueName = crypto.randomBytes(32).toString("hex");
    // console.log(file, process.env.REGION);
    const command = new PutObjectCommand({
      Bucket: process.env.SOURCE_BUCKET,
      Key: uniqueName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command).catch((err) => console.log(err));
  }
  let userid = mongoose.Types.ObjectId(user);
  let category = mongoose.Types.ObjectId(categoryid);
  let canvas = createCanvas();
  // let barcode = Math.floor(Math.random() * process.env.PASSWORD_KEY);
  // let barcodeImage = JsBarcode(canvas, barcode);
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  let offerValue = calculation(offer, price);
  // console.log(today, "date");
  const product = new productModel({
    productName: productName,
    category: category,
    quantity: quantity,
    manufacturingDate: manufacturingDate,
    kilogram: kilogram,
    price: price,
    expiryDate: expiryDate,
    user: userid,
    description: description,
    offer: offer,
    offerPrice: offerValue,
    barCode: barCode,
    image: uniqueName,
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
  for (const cat of products) {
    if (cat.image) {
      // let prod=cat
      cat.imageNumber = cat.image;
      const command = new GetObjectCommand({
        Bucket: process.env.SOURCE_BUCKET,
        Key: cat.image,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
      cat.image = url;
    }
  }
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
  let imageNumber = "";
  if (products.image) {
    imageNumber = products.image;
    const command = new GetObjectCommand({
      Bucket: process.env.SOURCE_BUCKET,
      Key: products.image,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
    products.image = url;
  }
  if (products) {
    return {
      success: true,
      status: 200,
      data: products,
      imageNumber: imageNumber,
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
  // console.log("category", category);
  let categoryid = mongoose.Types.ObjectId(category);
  const products = await productModel.find({ category: categoryid });
  for (const cat of products) {
    if (cat.image) {
      const command = new GetObjectCommand({
        Bucket: process.env.SOURCE_BUCKET,
        Key: cat.image,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
      cat.image = url;
    }
  }
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
export const updateProduct = async (
  {
    id,
    name,
    category,
    user,
    quantity,
    manufacturingDate,
    kilogram,
    price,
    expiryDate,
    description,
    offer,
    imageNumber,
  },
  file
) => {
  let uniqueName = "";
  let offerValue = calculation(offer, price);
  if (file && file.buffer) {
    uniqueName = crypto.randomBytes(32).toString("hex");
    // console.log(file, process.env.REGION);
    const command = new PutObjectCommand({
      Bucket: process.env.SOURCE_BUCKET,
      Key: uniqueName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command).catch((err) => console.log(err));
  } else {
    uniqueName = imageNumber;
  }
  let productid = mongoose.Types.ObjectId(id);
  let categoryid = mongoose.Types.ObjectId(category);
  let userid = mongoose.Types.ObjectId(user);
  // let offerValue = calculation(offer, price);

  const products = await productModel
    .findByIdAndUpdate(
      { _id: productid },
      {
        productName: name,
        categoryid: categoryid,
        quantity: quantity,
        image: uniqueName,
        manufacturingDate: manufacturingDate,
        kilogram: kilogram,
        price: price,
        expiryDate: expiryDate,
        user: userid,
        description: description,
        offerPrice: offerValue,
        offer: offer,
      }
    )
    .catch((err) => console.log(err, "lol"));
  const all = await productModel.find({ user: userid });
  if (products) {
    return {
      success: true,
      status: 200,
      data: products,
      allProduct: all,
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

//getproductbyofferprice
export const getproductbyofferprice = async ({ user, offer }) => {
  let userid = mongoose.Types.ObjectId(user);
  console.log(user, userid);
  const products = await productModel.find({ user: userid });
  for (const cat of products) {
    const command = new GetObjectCommand({
      Bucket: process.env.SOURCE_BUCKET,
      Key: cat.image,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
    cat.image = url;
  }
  if (products) {
    let offerProduct = products.filter((data) => data.offer > 0);
    if (offer) {
      offerPrice = products.filter((data) => data.offer >= offer);
    }
    return {
      success: true,
      status: 200,
      data: offerProduct,
    };
  } else {
    return {
      success: false,
      status: 400,
      message: "No data",
    };
  }
};
//getproductbydate
export const getProductByDate = async ({ user, date }) => {
  let userid = mongoose.Types.ObjectId(user);
  // const expiry = new Date().toLocaleDateString("en-GB");
  const today = new Date();

  // console.log(date, today, "date");
  let error = "";
  const products = await productModel
    .find({
      user: userid,
      expiryDate: { $gte: today, $lt: date },
    })
    .catch((err) => (error = err));
  for (const cat of products) {
    const command = new GetObjectCommand({
      Bucket: process.env.SOURCE_BUCKET,
      Key: cat.image,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
    cat.image = url;
  }
  if (products && !error) {
    return {
      success: true,
      status: 200,
      data: products,
    };
  } else {
    return {
      success: false,
      status: 404,
      message: error ? error : "Product unavailable",
    };
  }
};

//getProductbybarcode
export const getProductByBarCode = async ({ barCode }) => {
  let error = "";
  const product = await productModel
    .findOne({ barCode })
    .catch((err) => (error = err));
  for (const cat of product) {
    const command = new GetObjectCommand({
      Bucket: process.env.SOURCE_BUCKET,
      Key: cat.image,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
    cat.image = url;
  }
  if (product) {
    return {
      success: true,
      status: 200,
      data: product,
    };
  } else {
    return {
      success: false,
      status: 404,
      message: error ? error : "Not found",
    };
  }
};
