import { getUser, updateUser } from "../services/user.services";

export const getUserController = async (req, res) => {
  let getUserService = await getUser(req.body);
  return res.json(getUserService);
};

export const updateUserController = async (req, res) => {
  let updateUserService = await updateUser(req.body);
  return res.json(updateUserService);
};
