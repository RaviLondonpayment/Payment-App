import mongoose from "mongoose";
import tokenModel from "../models/token.model.js";
import bcrypt from "bcrypt";

export const verifyUser = async (req, res, next) => {
  //   console.log("reqbody", req.body);
  //   const hash = await bcrypt.hash(req.body.token, Number(bcryptSalt));
  //   console.log(hash);
  const id = mongoose.Types.ObjectId(req.body.user);
  console.log(id);
  const user = await tokenModel.findOne({ userId: id });
  //   console.log(eligible, "data");
  if (user) {
    const eligible = await bcrypt.compare(req.body.token, user.token);
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
      message: "Unauthorized",
    });
  }
};
