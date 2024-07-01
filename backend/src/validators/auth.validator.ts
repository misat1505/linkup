import { body } from "express-validator";

export const loginRules = [
  body("login")
    .exists()
    .withMessage("Login must be provided.")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Login must be at least 5 characters long."),
  body("password")
    .exists()
    .withMessage("Password must be provided.")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
];
