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
  // console.log(file, "crte");
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
  let mfdDate = "";
  let expDate = "";
  if (manufacturingDate) {
    mfdDate = new Date(manufacturingDate);
  }
  if (expiryDate) {
    expDate = new Date(expiryDate);
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
    manufacturingDate: mfdDate,
    kilogram: kilogram,
    price: price,
    expiryDate: expDate,
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

//get all products
export const getAllProduct = async () => {
  const products = await productModel.find();

  return {
    success: true,
    status: 200,
    data: products,
  };
};

//get product by customer-sort
export const getProductByCustomer = async ({ user, skip = 20 }) => {
  let userid = mongoose.Types.ObjectId(user);
  const today = new Date();
  //console.log(user, userid);
  const products = await productModel
    .find({ user: userid })
    .sort({ expiryDate: 1 })
    .limit(skip)
    .skip(skip > 20 ? skip - 20 : 0);

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
    // console.log(cat);
    let expiredate = new Date(cat.expiryDate);
    cat.expiresIn = Math.ceil(
      (expiredate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
  }
  if (products) {
    products.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    return {
      success: true,
      status: 200,
      data: products,
      skip: skip + 20,
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
      status: 404,
      message: "Product unavailable in this category",
    };
  }
};

//update product
export const updateProduct = async (
  {
    id,
    productName,
    categoryid,
    user,
    quantity,
    manufacturingDate,
    kilogram,
    price,
    expiryDate,
    description,
    offer,
    imageNumber,
    barCode,
  },
  file
) => {
  let uniqueName = "";
  let mfdDate = "";
  let expDate = "";
  if (manufacturingDate) {
    mfdDate = new Date(manufacturingDate);
  }
  if (expiryDate) {
    expDate = new Date(expiryDate);
  }
  let offerValue = calculation(offer, price);
  // console.log(categoryid, "catid");
  if (file && file.buffer) {
    // console.log("perfect");
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
    console.log("not perfect", imageNumber);
    uniqueName = imageNumber;
  }
  let productid = mongoose.Types.ObjectId(id);
  let category = mongoose.Types.ObjectId(categoryid);
  let userid = mongoose.Types.ObjectId(user);
  // let offerValue = calculation(offer, price);

  const products = await productModel
    .findByIdAndUpdate(
      { _id: productid },
      {
        productName: productName,
        category: category,
        quantity: quantity,
        image: uniqueName,
        manufacturingDate: mfdDate,
        kilogram: kilogram,
        price: price,
        expiryDate: expDate,
        user: userid,
        description: description,
        offerPrice: offerValue,
        offer: offer,
        barCode: barCode,
      }
    )
    .catch((err) => console.log(err, "lol"));
  const all = await productModel.find({ user: userid });
  if (products) {
    if (all) {
      for (const cat of all) {
        if (cat.image) {
          // let prod=cat
          cat.imageNumber = cat.image;
          const command = new GetObjectCommand({
            Bucket: process.env.SOURCE_BUCKET,
            Key: cat.image,
          });
          const url = await getSignedUrl(s3Client, command, {
            expiresIn: 36000,
          });
          cat.image = url;
        }
      }
    }
    return {
      success: true,
      status: 200,
      data: products,
      allProduct: all ? all : "",
    };
  } else {
    return {
      success: false,
      status: 404,
      message: "Product unavailable",
    };
  }
};

//update product price
export const updateProductPrice = async ({ id, price, barCode }) => {
  let userid = mongoose.Types.ObjectId(id);
  const products = await productModel
    .findOneAndUpdate(
      { barCode: barCode, user: userid },
      {
        price: price,
      }
    )
    .catch((err) => console.log(err, "lol"));

  if (products) {
    return {
      success: true,
      status: 200,
      message: "Product Price updated successfully",
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
  // console.log("offer", user, userid);
  const products = await productModel.find({ user: userid });
  // console.log("offer", products);
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
    let offerProduct = products.filter((data) => data.offer > 0);
    if (offer) {
      offerProduct = products.filter((data) => data.offer >= offer);
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

//getproductbydate-sort
export const getProductByDate = async ({ user, date, skip = 20 }) => {
  let userid = mongoose.Types.ObjectId(user);
  // const expiry = new Date().toLocaleDateString("en-GB");
  const today = new Date();
  let expiry = new Date(date);
  //console.log("date", today, expiry, userid);
  // console.log(date, today, "date");
  let error = "";
  const products = await productModel
    .find({
      user: userid,
      expiryDate: { $gte: today, $lt: expiry },
    })
    .sort({ expiryDate: 1 })
    .limit(skip)
    .skip(skip > 20 ? skip - 20 : 0)
    .catch((err) => (error = err));

  const expired = await productModel
    .find({
      user: userid,
      expiryDate: { $lt: today },
    })
    .limit(skip)
    .sort({ expiryDate: 1 })
    .skip(skip > 20 ? skip - 20 : 0)
    .catch((err) => console.log(err));
  // console.log(products);

  if (products && !error) {
    for (const cat of products) {
      if (cat.image) {
        const command = new GetObjectCommand({
          Bucket: process.env.SOURCE_BUCKET,
          Key: cat.image,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
        cat.image = url;
      }
      let expiredate = new Date(cat.expiryDate);
      cat.expiresIn = Math.ceil(
        (expiredate.getTime() - today.getTime()) / (1000 * 3600 * 24)
      );
      // console.log(
      //   Math.ceil((expiredate.getTime() - today.getTime()) / (1000 * 3600 * 24))
      // );
    }
    products.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    if (expired) {
      expired.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    }
    for (const exp of expired) {
      exp.imageNumber = exp.image;
      exp.expiresIn = 0;
      if (exp.image) {
        const command = new GetObjectCommand({
          Bucket: process.env.SOURCE_BUCKET,
          Key: exp.image,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
        exp.image = url;
      }
    }
    return {
      success: true,
      status: 200,
      data: products,
      expired: expired,
      skip: skip + 20,
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
  // for (const cat of product) {

  // }
  if (product) {
    if (product.image) {
      const command = new GetObjectCommand({
        Bucket: process.env.SOURCE_BUCKET,
        Key: product.image,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
      product.image = url;
    }
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

//getProductbyExpiryDate-sort
export const getProductByExpiryDate = async ({ user, skip = 20 }) => {
  let userid = mongoose.Types.ObjectId(user);
  const today = new Date();
  //console.log(user, userid);
  const products = await productModel
    .find({ user: userid, expiryDate: { $exists: true, $ne: null } })
    .sort({ expiryDate: 1 })
    .skip(skip > 20 ? skip - 20 : 0)
    .limit(skip);

  // console.log("pdts", products);
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
    let expiredate = new Date(cat.expiryDate);
    cat.expiresIn = Math.ceil(
      (expiredate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
  }
  if (products) {
    let expiryDate = products.filter((product) => product.expiryDate);
    expiryDate.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    // console.log("exp", expiryDate);
    return {
      success: true,
      status: 200,
      data: expiryDate,
      skip: skip + 20,
    };
  } else {
    return {
      success: false,
      status: 400,
      message: "No data",
    };
  }
};

//getProductbyExpiryDateAndCategory-sort
export const getProductbyExpiryDateAndCategory = async ({ user, category }) => {
  let userid = mongoose.Types.ObjectId(user);
  const today = new Date();
  //console.log(user, userid);
  const products = await productModel.find({
    user: userid,
    category: category,
  });
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
    let expiredate = new Date(cat.expiryDate);
    cat.expiresIn = Math.ceil(
      (expiredate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
  }
  if (products) {
    let expiryDate = products.filter((product) => product.expiryDate);
    expiryDate.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    return {
      success: true,
      status: 200,
      data: expiryDate,
    };
  } else {
    return {
      success: false,
      status: 400,
      message: "No data",
    };
  }
};

//getProductSortExpired-sort
export const getProductSortExpired = async ({ user }) => {
  let userid = mongoose.Types.ObjectId(user);
  const today = new Date();
  //console.log(user, userid);
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
    let expiredate = new Date(cat.expiryDate);
    cat.expiresIn = Math.ceil(
      (expiredate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
  }
  if (products) {
    let expiryDate = products.filter((product) => product.expiryDate);
    expiryDate.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    return {
      success: true,
      status: 200,
      data: expiryDate,
    };
  } else {
    return {
      success: false,
      status: 400,
      message: "No data",
    };
  }
};
