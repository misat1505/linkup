import { Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  refreshToken,
  signupUser,
} from "../controllers/auth.controller";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { loginRules, signupRules } from "../validators/auth.validator";
import { upload } from "../middlewares/multer";

const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("file"),
  validate(signupRules),
  signupUser
);
authRouter.post("/login", validate(loginRules), loginUser);
authRouter.post("/refresh", authorize, refreshToken);
authRouter.post("/logout", authorize, logoutUser);
authRouter.get("/user", authorize, getUser);

export default authRouter;
