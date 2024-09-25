import { Router } from "express";
import { upload } from "../../middlewares/multer";
import { validate } from "../../middlewares/validate";
import { signupRules } from "../../validators/auth.validator";
import { authorize } from "../../middlewares/authorize";
import { refreshTokenController } from "../../controllers/auth/refreshToken.controller";
import { logoutController } from "../../controllers/auth/logout.controller";
import { getSelfController } from "../../controllers/auth/getSelf.controller";
import { updateSelfController } from "../../controllers/auth/updateSelf.controller";

const authRouterProtected = Router();

authRouterProtected.post("/refresh", refreshTokenController);
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
