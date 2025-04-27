import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { validate } from "../../middlewares/validate";
import { signupRules } from "../../validators/auth.validator";
import { authorize } from "../../middlewares/authorize";
import { AuthControllers } from "../../controllers";

/**
 * Protected Authentication Routes Router.
 *
 * This router manages authentication-related routes that require authorization,
 * such as logging out, fetching user details, and updating user information.
 */
const authRouterProtected = Router();

authRouterProtected.post("/logout", AuthControllers.logout);
authRouterProtected.get("/user", AuthControllers.getSelf);
authRouterProtected.put(
  "/user",
  upload.single("file"),
  validate(signupRules),
  authorize,
  AuthControllers.updateSelf
);

export default authRouterProtected;
