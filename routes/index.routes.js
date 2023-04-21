import express from "express";
import {
  signUpController,
  loginController,
  resetController,
  forgetController,
} from "../controller/index.controllers.js";

const router = express.Router();

router.post("/auth/signup", signUpController);

router.get("/auth/login", loginController);

router.post("/auth/resetpassword", resetController);

router.get("/auth/forgetpassword", forgetController);

export { router };
