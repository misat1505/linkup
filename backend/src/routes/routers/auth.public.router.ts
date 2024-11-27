import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { validate } from "../../middlewares/validate";
import { loginRules, signupRules } from "../../validators/auth.validator";
import {
  authorize,
  authorizeWithRefreshToken,
} from "../../middlewares/authorize";
import { signupController } from "../../controllers/auth/signup.controller";
import { loginController } from "../../controllers/auth/login.controller";
import { refreshTokenController } from "../../controllers/auth/refreshToken.controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("file"),
  validate(signupRules),
  signupController
);
authRouter.post("/login", validate(loginRules), loginController);
authRouter.post("/refresh", authorizeWithRefreshToken, refreshTokenController);

export default authRouter;
