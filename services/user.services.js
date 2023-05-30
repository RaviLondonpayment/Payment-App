import mongoose from "mongoose";
import userModel from "../models/user.model.js";

//getuser
export const getUser = async ({ user }) => {
  let userid = mongoose.Types.ObjectId(user);
  let error = "";
  const users = await userModel
    .findOne({ _id: userid })
    .catch((err) => (error = err));
  if (users) {
    return {
      success: true,
      status: 200,
      data: users,
    };
  } else {
    if (error) {
      return {
        success: false,
        status: 400,
        error: error,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "Not found",
      };
    }
  }
};

//updateuser
export const updateUser = async (payload, file) => {
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
  let userid = mongoose.Types.ObjectId(payload.user);
  let error = "";
  const user = await userModel
    .findByIdAndUpdate(
      { _id: userid },
      {
        email: payload.email,
        name: payload.name,
        ownerName: payload.ownerName,
        shopAddress: payload.shopAddress,
        country: payload.country,
        image: uniqueName,
      }
    )
    .catch((err) => (error = err));
  if (user) {
    return {
      success: true,
      status: 200,
      data: user,
    };
  } else {
    if (error) {
      return {
        success: false,
        status: 400,
        error: error,
      };
    } else {
      return {
        success: false,
        status: 404,
        message: "Not found",
      };
    }
  }
};

//deleteuser
export const deleteuser = (id) => {};
