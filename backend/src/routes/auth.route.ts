import { Router } from "express";
import { getUser, loginUser } from "../controllers/auth.controller";
import { body } from "express-validator";
import { authorize } from "../middlewares/authorize";

const authRouter = Router();

const loginValidationRules = [
  body("login")
    .exists()
    .isLength({ min: 5 })
    .withMessage("Login must be at least 5 characters long"),
  body("password")
    .exists()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

authRouter.post("/login", loginValidationRules, loginUser);
authRouter.get("/user", authorize, getUser);

export default authRouter;
