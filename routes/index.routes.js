import express from "express";
import {
  signUpController,
  loginController,
  resetController,
  resetPasswordRequestController,
  logoutController,
  //   forgetController,
} from "../controller/index.controllers.js";

const router = express.Router();

//Authentication
router.post("/auth/signup", signUpController);

router.post("/auth/login", loginController);

router.post("/auth/resetpassword", resetController);

router.post("/auth/resetpasswordrequest", resetPasswordRequestController);

router.post("/auth/logout", logoutController);

// router.get("/product/getproductbyid")
// router.get("/auth/forgetpassword", forgetController);

export { router };
