import { Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { loginRules } from "../validators/auth.validator";

const authRouter = Router();

authRouter.post("/login", validate(loginRules), loginUser);
authRouter.post("/refresh", authorize, refreshToken);
authRouter.post("/logout", authorize, logoutUser);
authRouter.get("/user", authorize, getUser);

export default authRouter;
