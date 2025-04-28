import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import {
  RequestValidatedValues,
  RequestValidation,
} from "../types/RequestValidation";
import { ZodError } from "zod";

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

    const i18nErrors = errors.array().map((err) => ({
      ...err,
      msg: req.t(err.msg),
    }));

    res.status(400).json({ errors: i18nErrors });
  };
};

export const zodValidate = (validations: RequestValidation) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validated = {} as RequestValidatedValues;
    const errors: ZodError<any>[] = [];

    Object.entries(validations).forEach(([key, schema]) => {
      const typedKey = key as keyof RequestValidatedValues;
      const result = schema.safeParse(req[typedKey]);
      if (!result.success) errors.push(result.error);
      else validated[typedKey] = result.data;
    });

    if (errors.length === 0) {
      req.validated = validated;
      return next();
    }

    res.status(400).json({ errors });
  };
};
