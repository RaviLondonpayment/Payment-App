import express from "express";
import {
  signUpController,
  loginController,
  resetController,
  resetPasswordRequestController,
  //   forgetController,
} from "../controller/index.controllers.js";

const router = express.Router();

router.post("/auth/signup", signUpController);

router.post("/auth/login", loginController);

router.post("/auth/resetpassword", resetController);

router.post("/auth/resetpasswordrequest", resetPasswordRequestController);
// router.get("/auth/forgetpassword", forgetController);

export { router };
