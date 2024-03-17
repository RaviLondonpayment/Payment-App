import express from "express";
import {
  getAllUserController,
  getUserByNameController,
  getUserController,
  updateUserController,
  updateUserSubscriptionController,
} from "../controller/user.controllers.js";
import { verifyUser, verifyUserVtwo } from "../verification/verification.js";
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

router.post("/getalluser", verifyUser, getAllUserController);

router.post("/getuserbyname", verifyUser, getUserByNameController);

router.post(
  "/updateusersubscription",
  verifyUserVtwo,
  updateUserSubscriptionController
);

export { router };
