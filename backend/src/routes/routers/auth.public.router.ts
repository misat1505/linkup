import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { validate } from "../../middlewares/validate";
import { loginRules, signupRules } from "../../validators/auth.validator";
import {
  getUser,
  loginUser,
  logoutUser,
  refreshToken,
  signupUser,
  updateUser,
} from "../../controllers/auth.controller";
import {
  authorize,
  authorizeOnRefreshToken,
} from "../../middlewares/authorize";

const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("file"),
  validate(signupRules),
  signupUser
);
authRouter.post("/login", validate(loginRules), loginUser);
authRouter.post("/refresh", authorizeOnRefreshToken, refreshToken);
authRouter.post("/logout", authorize, logoutUser);
authRouter.get("/user", authorizeOnRefreshToken, getUser);
authRouter.put(
  "/user",
  upload.single("file"),
  validate(signupRules),
  authorize,
  updateUser
);

export default authRouter;
