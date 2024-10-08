import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
  /**
   * Middleware validating request based on provided rules.
   *
   * Terminates request on failure and returns errors.
   * Otherwise, calls next function.
   */

  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};
