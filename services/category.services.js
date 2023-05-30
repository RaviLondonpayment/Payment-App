import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import mongoose from "mongoose";
import { s3Client } from "../libraries/bucket.js";
import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
import crypto from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// import mongoose from "mongoose";
//create category
export const createCategory = async (
  { categoryName, categoryDescription, colorCode, user },
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

  let id = new mongoose.Types.ObjectId(user);
  // console.log("lol", categoryName, categoryDescription, colorCode, user);
  const category = new categoryModel({
    image: uniqueName,
    categoryName: categoryName,
    categoryDescription: categoryDescription,
    colorCode: colorCode,
    user: id,
  });
  let error = "";
  await category.save().catch((err) => {
    error = {
      status: 400,
      success: false,
      message: err,
    };
  });
  if (error) {
    return error;
  } else {
    return { success: true, message: "Category created succesfully" };
  }
};

//getall categories
export const getAllCategories = async () => {
  const categories = categoryModel.find();
  if (categories) {
    return {
      data: categories,
    };
  } else {
    return { success: false, status: 404, message: "No category available" };
  }
};

//get category by id
export const getCategoryById = async ({ id }) => {
  let objId = mongoose.Types.ObjectId(id);

  const category = await categoryModel.findById({ _id: objId });
  let imageId = category.image;
  if (category.image) {
    const command = new GetObjectCommand({
      Bucket: process.env.SOURCE_BUCKET,
      Key: category.image,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
    category.image = url;
  }
  if (category) {
    return {
      success: true,
      status: 200,
      data: category,
      imageNumber: imageId,
    };
  } else {
    return { success: false, status: 404, message: "Category unavailable" };
  }
};

//update category
export const updateCategory = async (
  { id, categoryName, categoryDescription, colorCode, user, imageNumber },
  file
) => {
  let objId = mongoose.Types.ObjectId(id);
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
  // console.log(objId, "lol", id, categoryName, categoryDescription, colorCode);
  const category = await categoryModel.findByIdAndUpdate(
    { _id: objId },
    {
      image: uniqueName ? uniqueName : imageNumber,
      categoryName: categoryName,
      categoryDescription: categoryDescription,
      colorCode: colorCode,
      user: user,
    }
  );
  if (category) {
    return {
      success: true,
      status: 200,
      message: "Category updated successfully",
    };
  } else {
    return {
      success: false,
      status: 404,
      message: "failed. Not found",
    };
  }
};

//get category by customer
export const getCategoryByCustomer = async ({ user }) => {
  // console.log("getbycustomer");
  let objId = mongoose.Types.ObjectId(user);
  const category = await categoryModel.find({ user: objId });
  if (category.image) {
    for (const cat of category) {
      // console.log("value", cat);
      cat.imageNumber = cat.image;
      const command = new GetObjectCommand({
        Bucket: process.env.SOURCE_BUCKET,
        Key: cat.image,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
      cat.image = url;
    }
  }
  if (category) {
    return {
      success: true,
      status: 200,
      data: category,
    };
  } else {
    return {
      success: false,
      status: 404,
      message: "not found",
    };
  }
};

//getcount
export const getCount = async ({ user }) => {
  const userid = mongoose.Types.ObjectId(user);
  const categoryCount = await categoryModel.find({ user: userid });
  const productCount = await productModel.find({ user: userid });

  if (categoryCount && productCount) {
    return {
      success: true,
      status: 200,
      categoryCount: categoryCount.length,
      productCount: productCount.length,
    };
  } else {
    return {
      success: false,
      status: 404,
      message: "Not found",
    };
  }
};

//delete category
// export const deleteCategory = async (id) => {
//   const category = await categoryModel.deleteOne({ _id: id });
//   if (category) {
//     return {
//       success: true,
//       status: 200,
//       message: "Category deleted",
//     };
//   } else {
//     return { success: false, status: 404, message: "Category unavailable" };
//   }
// };
