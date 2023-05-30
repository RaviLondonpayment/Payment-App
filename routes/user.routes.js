import express from "express";
import {
  getUserController,
  updateUserController,
} from "../controller/user.controllers.js";
import { verifyUser } from "../verification/verification.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let router = express.Router();

router.post("/getuser", verifyUser, getUserController);

router.post(
  "/updateuser",
  upload.single("image"),
  verifyUser,
  updateUserController
);

export { router };
