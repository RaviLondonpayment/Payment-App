import {
  signup,
  login,
  requestPasswordReset,
  resetPassword,
  logout,
} from "../services/index.services.js";

export const signUpController = async (req, res, next) => {
  console.log(req.body);
  const signupService = await signup(req.body);
  console.log("output", signupService);
  return res.json(signupService);
};

export const loginController = async (req, res, next) => {
  // console.log(req.body);
  const loginService = await login(req.body);
  return res.json(loginService);
};

export const resetController = async (req, res, next) => {
  const resetService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );
  return res.json(resetService);
};

// export const forgetController = async (req, res, next) => {
//   const forgetPasswordService = '';
//   return res.json(forgetPasswordService)
// };

export const resetPasswordRequestController = async (req, res, next) => {
  console.log("triggered");
  const resetPasswordRequestService = await requestPasswordReset(
    req.body.email
  );
  return res.json(resetPasswordRequestService);
};

export const logoutController = async (req, res, next) => {
  const logoutService = await logout(req.body);
  return res.json(logoutService);
};
