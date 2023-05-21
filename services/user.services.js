import mongoose from "mongoose";
import userModel from "../models/user.model";

//getuser
export const getUser = async ({ id }) => {
  let userid = mongoose.Types.ObjectId(id);
  let error = "";
  const user = await userModel
    .findOne({ _id: userid })
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

//updateuser
export const updateUser = async (payload) => {
  let userid = mongoose.Types.ObjectId(payload.id);
  let error = "";
  const user = await userModel
    .findOneAndUpdate(
      { _id: userid },
      {
        email: payload.email,
        name: payload.name,
        password: passwordGenerator,
        ownerName: payload.ownerName,
        shopAddress: payload.shopAddress,
        country: payload.country,
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
