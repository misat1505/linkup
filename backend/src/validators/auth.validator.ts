import { body } from "express-validator";

/**
 * Validation rules for login requests.
 * These rules ensure that the login and password fields are provided,
 * are strings, and meet the specified length constraints.
 *
 * - `login`: Required, must be a string, and must be between 5 and 50 characters.
 * - `password`: Required, must be a string, and must be at least 5 characters long.
 *
 * @constant
 */
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

/**
 * Validation rules for signup requests.
 * These rules ensure that the required user fields (first name, last name, login, and password)
 * are provided, are strings, and meet the specified length constraints.
 *
 * - `firstName`: Required, must be a string, not empty, and at most 50 characters long.
 * - `lastName`: Required, must be a string, not empty, and at most 50 characters long.
 * - `login`: Required, must be a string, and must be between 5 and 50 characters.
 * - `password`: Required, must be a string, and must be at least 5 characters long.
 *
 * @constant
 */
export const signupRules = [
  body("firstName")
    .exists()
    .withMessage("First name must be provided.")
    .bail()
    .isString()
    .withMessage("First name must be a string.")
    .bail()
    .notEmpty()
    .withMessage("First name must not be empty.")
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
    .notEmpty()
    .withMessage("Last name must not be empty.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Last name must be at most 50 characters long."),
  body("login")
    .exists()
    .withMessage("Login must be provided.")
    .bail()
    .isString()
    .withMessage("Login has to be a string.")
    .bail()
    .isLength({ min: 5, max: 50 })
    .withMessage("Login must be at least 5 characters long."),
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
