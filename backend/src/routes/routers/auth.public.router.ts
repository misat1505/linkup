import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { validate, zodValidate } from "../../middlewares/validate";
import { loginRules, signupRules } from "../../validators/auth.validator";
import { authorizeWithRefreshToken } from "../../middlewares/authorize";
import { AuthControllers } from "../../controllers";
import { LoginDTO } from "../../validators/auth/login.validators";

/**
 * Public Authentication Routes Router.
 *
 * This router handles authentication-related routes, including signup, login, and token refresh that doesn't require authorization via access token.
 */
const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("file"),
  validate(signupRules),
  AuthControllers.signup
);
authRouter.post(
  "/login",
  zodValidate({ body: LoginDTO }),
  AuthControllers.login
);
authRouter.post(
  "/refresh",
  authorizeWithRefreshToken,
  AuthControllers.refreshToken
);

export default authRouter;
