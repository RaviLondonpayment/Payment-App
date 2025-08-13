import mongoose from "mongoose";
import tokenModel from "../models/token.model.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";

export const verifyUser = async (req, res, next) => {
  // console.log("reqbody", req.body);
  //   const hash = await bcrypt.hash(req.body.token, Number(bcryptSalt));
  //   console.log(hash);
  const id = mongoose.Types.ObjectId(req.body.tokenid);
  const userid = mongoose.Types.ObjectId(req.body.user);
  // console.log(id);
  const user = await tokenModel.findOne({
    _id: id,
  });
  if (user) {
    const verification = await userModel.findOne({ _id: userid });
    if (verification?.subscribed) {
      const eligible = await bcrypt.compare(req.body.token, user.token);
      // console.log(eligible, "data");
      if (eligible) {
        res.locals.user = id;
        next();
      } else {
        res.json({
          success: false,
          status: 401,
          message: "Unauthorized",
        });
      }
    } else {
      res.json({
        success: false,
        status: 403,
        message: "You don't have permission to access. Kindly contact admin",
      });
    }
  } else {
    res.json({
      success: false,
      status: 401,
      message: "User doesnt exist",
    });
  }
};

export const verifyUserVtwo = async (req, res, next) => {
  // console.log("reqbody", req.body);
  //   const hash = await bcrypt.hash(req.body.token, Number(bcryptSalt));
  //   console.log(hash);
  const id = mongoose.Types.ObjectId(req.body.tokenid);
  const userid = mongoose.Types.ObjectId(req.body.user);
  // console.log(id);
  const user = await tokenModel.findOne({
    _id: id,
  });
  if (user) {
    const eligible = await bcrypt.compare(req.body.token, user.token);
    // console.log(eligible, "data");
    if (eligible) {
      res.locals.user = id;
      next();
    } else {
      res.json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }
  } else {
    res.json({
      success: false,
      status: 401,
      message: "User doesnt exist",
    });
  }
};
