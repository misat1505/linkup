import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { validate } from "../../middlewares/validate";
import { loginRules, signupRules } from "../../validators/auth.validator";
import { loginUser, signupUser } from "../../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("file"),
  validate(signupRules),
  signupUser
);
authRouter.post("/login", validate(loginRules), loginUser);

export default authRouter;
