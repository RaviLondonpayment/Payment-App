import express from "express";
import {
  getUserController,
  updateUserController,
} from "../controller/user.controllers.js";
import { verifyUser } from "../verification/verification.js";

let router = express.Router();

router.post("/getuser", verifyUser, getUserController);

router.post("/updateuser", verifyUser, updateUserController);

export { router };
