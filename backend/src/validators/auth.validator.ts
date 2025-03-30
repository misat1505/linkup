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
    .withMessage("auth.validators.login.login.empty")
    .bail()
    .isString()
    .withMessage("auth.validators.login.login.not-string")
    .bail()
    .isLength({ min: 5, max: 50 })
    .withMessage("auth.validators.login.login.bad-length"),
  body("password")
    .exists()
    .withMessage("auth.validators.login.password.empty")
    .bail()
    .isString()
    .withMessage("auth.validators.login.password.not-string")
    .bail()
    .isLength({ min: 5 })
    .withMessage("auth.validators.login.password.bad-length"),
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
    .withMessage("auth.validators.signup.firstName.not-exists")
    .bail()
    .isString()
    .withMessage("auth.validators.signup.firstName.not-string")
    .bail()
    .notEmpty()
    .withMessage("auth.validators.signup.firstName.empty")
    .bail()
    .isLength({ max: 50 })
    .withMessage("auth.validators.signup.firstName.bad-length"),
  body("lastName")
    .exists()
    .withMessage("auth.validators.signup.lastName.not-exists")
    .bail()
    .isString()
    .withMessage("auth.validators.signup.lastName.not-string")
    .bail()
    .notEmpty()
    .withMessage("auth.validators.signup.lastName.empty")
    .bail()
    .isLength({ max: 50 })
    .withMessage("auth.validators.signup.lastName.bad-length"),
  body("login")
    .exists()
    .withMessage("auth.validators.signup.login.empty")
    .bail()
    .isString()
    .withMessage("auth.validators.signup.login.not-string")
    .bail()
    .isLength({ min: 5, max: 50 })
    .withMessage("auth.validators.signup.login.bad-length"),
  body("password")
    .exists()
    .withMessage("auth.validators.signup.password.empty")
    .bail()
    .isString()
    .withMessage("auth.validators.signup.password.not-string")
    .bail()
    .isLength({ min: 5 })
    .withMessage("auth.validators.signup.password.bad-length"),
];
