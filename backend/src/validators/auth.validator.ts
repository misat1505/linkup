import { body } from "express-validator";

export const loginRules = [
  body("login")
    .exists()
    .withMessage("Login must be provided.")
    .bail()
    .isString()
    .withMessage("Login has to be a string.")
    .bail()
    .isLength({ min: 5, max: 50 })
    .withMessage("Login must be between 5 and 50 characters long."),
  body("password")
    .exists()
    .withMessage("Password must be provided.")
    .bail()
    .isString()
    .withMessage("Password has to be a string.")
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
    .isLength({ max: 50 })
    .withMessage("First name must be at most 50 characters long."),
  body("lastName")
    .exists()
    .withMessage("Last name must be provided.")
    .bail()
    .isString()
    .withMessage("Last name must be a string.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Last name must be at most 50 characters long."),
  body("login")
    .exists()
    .withMessage("Login must be provided.")
    .bail()
    .isLength({ min: 5, max: 50 })
    .withMessage("Login must be at least 5 characters long."),
  body("password")
    .exists()
    .withMessage("Password must be provided.")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
];
