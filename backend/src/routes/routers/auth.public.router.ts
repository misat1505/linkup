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
import { logoutController } from "../../controllers/auth/logout.controller";
import { getSelfController } from "../../controllers/auth/getSelf.controller";
import { updateSelfController } from "../../controllers/auth/updateSelf.controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("file"),
  validate(signupRules),
  signupController
);
authRouter.post("/login", validate(loginRules), loginController);
authRouter.post("/refresh", authorizeWithRefreshToken, refreshTokenController);
authRouter.post("/logout", authorize, logoutController);
authRouter.get("/user", authorizeWithRefreshToken, getSelfController);
authRouter.put(
  "/user",
  upload.single("file"),
  validate(signupRules),
  authorize,
  updateSelfController
);

export default authRouter;
