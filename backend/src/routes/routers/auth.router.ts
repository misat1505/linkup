import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { validate } from "../../middlewares/validate";
import { signupRules } from "../../validators/auth.validator";
import { authorize } from "../../middlewares/authorize";
import { logoutController } from "../../controllers/auth/logout.controller";
import { getSelfController } from "../../controllers/auth/getSelf.controller";
import { updateSelfController } from "../../controllers/auth/updateSelf.controller";

/**
 * Protected Authentication Routes Router.
 *
 * This router manages authentication-related routes that require authorization,
 * such as logging out, fetching user details, and updating user information.
 */
const authRouterProtected = Router();

authRouterProtected.post("/logout", logoutController);
authRouterProtected.get("/user", getSelfController);
authRouterProtected.put(
  "/user",
  upload.single("file"),
  validate(signupRules),
  authorize,
  updateSelfController
);

export default authRouterProtected;
