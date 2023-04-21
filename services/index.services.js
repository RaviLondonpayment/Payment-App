import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
import tokenModel from "../models/token.model";
import crypto from "crypto";
import bcrypt from "bcrypt";
const { sign, verify } = jwt;
const JWTsecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
// const crypto= c
export const signup = (payload) => {
  let user = userModel.findOne({ email: payload.email });
  if (user) {
    throw new Error("Email already exist", 422);
  }
  user = new userModel(payload);
  const token = sign({ id: user._id }, JWTsecret);
  await user.save();
  return (data={
      userId:user._id,
      email:user.email,
      name:user.name,

  })
};

export const login = (payload) => {
  let token = sign();
  let user = userModel.findByIdAndUpdate({ email: payload.email });
  if (user) {
  }
};

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
  
    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  
    sendEmail(
      user.email,
      "Password Reset Request",
      {
        name: user.name,
        link: link,
      },
      "./template/requestResetPassword.handlebars"
    );
    return { link };
  };
  
export const resetPassword = async (userId, token, password) => {
    let passwordResetToken = await tokenModel.findOne({ userId });
  
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
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

