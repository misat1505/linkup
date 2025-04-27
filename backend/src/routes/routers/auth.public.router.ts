import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { validate } from "../../middlewares/validate";
import { loginRules, signupRules } from "../../validators/auth.validator";
import { authorizeWithRefreshToken } from "../../middlewares/authorize";
import { AuthControllers } from "../../controllers";

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
authRouter.post("/login", validate(loginRules), AuthControllers.login);
authRouter.post(
  "/refresh",
  authorizeWithRefreshToken,
  AuthControllers.refreshToken
);

export default authRouter;
