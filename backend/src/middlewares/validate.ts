import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

/**
 * Middleware to validate the request based on provided validation rules.
 *
 * This middleware accepts an array of validation chains from `express-validator` and runs them on the incoming request.
 * If validation fails, it terminates the request and returns the validation errors as a response.
 * If validation passes, it proceeds to the next middleware or route handler.
 *
 * @param {ValidationChain[]} validations - An array of validation chains from `express-validator` to be applied to the request.
 *
 * @example
 * const validations = [
 *   body("email").isEmail().withMessage("Invalid email format"),
 *   body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
 * ];
 * app.post('/login', validate(validations), loginHandler);
 *
 * @source
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};
