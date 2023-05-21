import express from "express";
import {
  getUserController,
  updateUserController,
} from "../controller/user.controllers";
import { verifyUser } from "../verification/verification";

let router = express.Router();

router.post("/getuser", verifyUser, getUserController);

router.post("/updateuser", verifyUser, updateUserController);

export { router };
