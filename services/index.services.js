import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import tokenModel from "../models/token.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

const { sign, verify } = jwt;
const JWTsecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;

//signup
export const signup = async (payload) => {
  let user = await userModel.findOne({ email: payload.email });
  if (user) {
    return {
      success: false,
      status: 422,
      message: "username already taken",
    };
  }
  user = new userModel(payload);

  const token = sign({ id: user._id }, process.env.JWT_SECRET);
  await new tokenModel({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  //   let resetToken = crypto.randomBytes(32).toString("hex");
  //   const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
  const link = `${process.env.CLIENT_URL}/passwordReset?token=${token}&id=${user._id}`;

  console.log(user);
  await user.save();
  sendEmail(
    user.email,
    "Set password",
    {
      name: user.name,
      link: link,
    },
    "./template/setPassword.handlebars"
  );
  return {
    userId: user._id,
    email: user.email,
    name: user.name,
    ownerName: user.ownerName,
    shopAddress: user.shopAddress,
    country: user.country,
    token: token,
  };
};

//login
export const login = (payload) => {
  let token = sign();
  let user = userModel.findByIdAndUpdate({ email: payload.email });
  if (user) {
  }
};

//requestpasswordreset
export const requestPasswordReset = async (email) => {
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("Email does not exist");

  let token = await tokenModel.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new tokenModel({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;

  let response = await sendEmail(
    user.email,
    "Password Reset Request",
    {
      name: user.name,
      link: link,
    },
    "./template/requestResetPassword.handlebars"
  );
  console.log("mail", response);
  return { link };
};

//resetpassword
export const resetPassword = async (userId, token, password) => {
  console.log(userId);
  let passwordResetToken = await tokenModel.findOne({ userId });

  if (!passwordResetToken) {
    //throw new Error("Invalid or expired password reset token");
    return {
      success: false,
      message: "Invalid or expired password reset token",
    };
  }

  console.log(passwordResetToken.token, token);

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  const hash = await bcrypt.hash(password, Number(bcryptSalt));

  await userModel.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await userModel.findById({ _id: userId });

  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.name,
    },
    "./template/resetPassword.handlebars"
  );

  await passwordResetToken.deleteOne();

  return { message: "Password reset was successful" };
};
