import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { authorizeWithRefreshToken } from "../../middlewares/authorize";
import { AuthControllers } from "../../controllers";
import { LoginDTO } from "../../validators/auth/login.validators";
import { SignupDTO } from "../../validators/auth/signup.validators";
import { validate } from "../../middlewares/validate";

/**
 * Public Authentication Routes Router.
 *
 * This router handles authentication-related routes, including signup, login, and token refresh that doesn't require authorization via access token.
 */
const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("file"),
  validate({ body: SignupDTO }),
  AuthControllers.signup
);
authRouter.post("/login", validate({ body: LoginDTO }), AuthControllers.login);
authRouter.post(
  "/refresh",
  authorizeWithRefreshToken,
  AuthControllers.refreshToken
);

export default authRouter;
