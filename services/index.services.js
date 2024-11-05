import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import tokenModel from "../models/token.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import mongoose from "mongoose";

const { sign, verify } = jwt;
const JWTsecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;

//signup
export const signup = async (payload) => {
  //console.log(payload, process.env.PASSWORD_KEY);
  let user = await userModel.findOne({ email: payload.email });
  if (user) {
    return {
      success: false,
      status: 422,
      message: "username already taken",
    };
  }
  const passwordGenerator =
    "@" + Math.floor(Math.random() * process.env.PASSWORD_KEY) + "lpa";
  user = new userModel({
    email: payload.email,
    name: payload.name,
    password: passwordGenerator,
    ownerName: payload.ownerName,
    shopAddress: payload.shopAddress,
    country: payload.country,
    subscribed: true,
    userRole: "User",
  });

  // const token = sign({ id: user._id }, process.env.JWT_SECRET);
  // let resetToken = crypto.randomBytes(32).toString("hex");
  // const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
  // await new tokenModel({
  //   userId: user._id,
  //   token: hash,
  //   createdAt: Date.now(),
  // }).save();

  //   let resetToken = crypto.randomBytes(32).toString("hex");
  //   const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
  //const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;

  //console.log(user);
  //await user.save({
  // email: payload.email,
  // name: payload.name,
  //password: passwordGenerator,
  // ownerName: payload.ownerName,
  // shopAddress: payload.shopAddress,
  // country: payload.country,
  //});
  user.save();
  sendEmail(
    user.email,
    "Set password",
    {
      name: user.name,
      //link: link,
      password: passwordGenerator,
    },
    "./template/setPassword.handlebars"
  );
  return {
    success: true,
    status: 200,
    userId: user._id,
    email: user.email,
    name: user.name,
    ownerName: user.ownerName,
    shopAddress: user.shopAddress,
    country: user.country,
    userRole: user.userRole,
    // password: passwordGenerator,
  };
};

//login
export const login = async ({ email, password }) => {
  // let token = sign();
  let user = await userModel.findOne({ email: email });
  // console.log("User name", user);

  if (user) {
    let passwordCheck = await bcrypt.compare(password, user.password);
    // console.log(passwordCheck);
    if (passwordCheck) {
      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
      const data = await tokenModel.create({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      });
      //console.log("token", data);
      return {
        success: true,
        userId: user._id,
        message: `welcome ${user.ownerName}`,
        token: resetToken,
        tokenid: data._id,
        username: user.ownerName,
        name: user.name,
        userRole: user.userRole,
      };
    } else {
      return {
        success: false,
        status: 401,
        message: "Invalid Password",
      };
    }
  } else {
    return {
      success: false,
      status: 401,
      message: "Username doesn't exist",
    };
  }
};

//logout
export const logout = async ({ tokenid }) => {
  let userid = mongoose.Types.ObjectId(tokenid);
  const data = await tokenModel.findOneAndDelete({
    _id: userid,
  });
  if (data) {
    return {
      success: true,
      status: 200,
      message: "Logout successfully",
    };
  } else {
    return {
      success: false,
      status: 400,
      message: "Not found",
    };
  }
};

//requestpasswordreset
export const requestPasswordReset = async (email) => {
  let error = "";
  const passwordGenerator =
    "@" + Math.floor(Math.random() * process.env.PASSWORD_KEY) + "lpa";
  const hash = await bcrypt.hash(passwordGenerator, Number(bcryptSalt));
  const user = await userModel
    .findOneAndUpdate(
      { email: email },
      { $set: { password: hash } },
      { new: true }
    )
    .catch((err) => (error = err));

  let token = await tokenModel.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hashtoken = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new tokenModel({
    userId: user._id,
    token: hashtoken,
    createdAt: Date.now(),
  }).save();
  // const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;

  let response = await sendEmail(
    user.email,
    "Password Reset Request",
    {
      name: user.name,
      link: passwordGenerator,
    },
    "./template/requestResetPassword.handlebars"
  );
  //console.log("mail", response);
  if (user) {
    return { success: true, status: 200, message: "reset working" };
  } else {
    return { success: false, message: error };
  }
};

//resetpassword
export const resetPassword = async (userId, token, password) => {
  //console.log(userId);
  // let passwordResetToken = await tokenModel.findOne({ userId });

  // if (!passwordResetToken) {
  //   return {
  //     success: false,
  //     message: "Invalid or expired password reset token",
  //   };
  // }

  // const isValid = await bcrypt.compare(token, passwordResetToken.token);
  // //console.log(isValid, "output");
  // if (!isValid) {
  //   // throw new Error("Invalid or expired password reset token");
  //   return {
  //     success: false,
  //     status: 404,
  //     message: "Invalid or expired password reset token",
  //   };
  // }

  const hash = await bcrypt.hash(password, Number(bcryptSalt));

  await userModel.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await userModel.findById({ _id: userId });
  try {
    await tokenModel.deleteMany({ userId: userId });
  } catch (err) {
    console.log(error);
  }
  // sendEmail(
  //   user.email,
  //   "Password Reset Successfully",
  //   {
  //     name: user.name,
  //   },
  //   "./template/resetPassword.handlebars"
  // );

  // await passwordResetToken.deleteOne();

  return {
    success: true,
    status: 200,
    message: "Password reset was successful",
  };
};
