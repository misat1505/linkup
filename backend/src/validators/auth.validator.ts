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

export const signupRules = [
  body("firstName")
    .exists()
    .withMessage("First name must be provided.")
    .bail()
    .isString()
    .withMessage("First name must be a string.")
    .bail()
    .notEmpty()
    .withMessage("First name cannot be empty."),
  body("lastName")
    .exists()
    .withMessage("Last name must be provided.")
    .bail()
    .isString()
    .withMessage("Last name must be a string.")
    .bail()
    .notEmpty()
    .withMessage("Last name cannot be empty."),
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
