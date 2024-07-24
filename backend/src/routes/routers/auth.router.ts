import { Router } from "express";
import {
  getUser,
  logoutUser,
  refreshToken,
} from "../../controllers/auth.controller";

const authRouterProtected = Router();

authRouterProtected.post("/refresh", refreshToken);
authRouterProtected.post("/logout", logoutUser);
authRouterProtected.get("/user", getUser);

export default authRouterProtected;
