import {
  getAllUser,
  getUser,
  getUserByName,
  updateUser,
  updateUserSubscription,
} from "../services/user.services.js";

export const getUserController = async (req, res) => {
  let getUserService = await getUser(req.body);
  return res.json(getUserService);
};

export const updateUserController = async (req, res) => {
  let updateUserService = await updateUser(req.body, req.file);
  return res.json(updateUserService);
};

export const getAllUserController = async (req, res) => {
  let getAllUserService = await getAllUser(req.body);
  return res.json(getAllUserService);
};

export const getUserByNameController = async (req, res) => {
  let getUserByNameService = await getUserByName(req.body);
  return res.json(getUserByNameService);
};

export const updateUserSubscriptionController = async (req, res) => {
  console.log(req.body, "update");
  let updateUserSubscriptionService = await updateUserSubscription(req.body);
  return res.json(updateUserSubscriptionService);
};
