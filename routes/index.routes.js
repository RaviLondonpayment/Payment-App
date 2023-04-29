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
router.post("/signup", signUpController);

router.post("/login", loginController);

router.post("/resetpassword", resetController);

router.post("/resetpasswordrequest", resetPasswordRequestController);

router.post("/logout", logoutController);

// router.get("/product/getproductbyid")
// router.get("/auth/forgetpassword", forgetController);

export { router };
