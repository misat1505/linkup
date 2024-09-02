import { Router } from "express";
import {
  getUser,
  logoutUser,
  refreshToken,
  updateUser,
} from "../../controllers/auth.controller";
import { upload } from "../../middlewares/multer";
import { validate } from "../../middlewares/validate";
import { signupRules } from "../../validators/auth.validator";
import { authorize } from "../../middlewares/authorize";

const authRouterProtected = Router();

authRouterProtected.post("/refresh", refreshToken);
authRouterProtected.post("/logout", logoutUser);
authRouterProtected.get("/user", getUser);
authRouterProtected.put(
  "/user",
  upload.single("file"),
  validate(signupRules),
  authorize,
  updateUser
);

export default authRouterProtected;
