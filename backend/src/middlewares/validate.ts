import { NextFunction, Request, Response } from "express";
import {
  RequestValidatedValues,
  RequestValidation,
} from "../types/RequestValidation";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware to validate Express request properties using Zod schemas.
 *
 * This middleware accepts a `RequestValidation` object containing Zod schemas
 * for request sections such as `body`, `query`, or `params`. It validates
 * these sections of the incoming request. If all validations succeed, the
 * parsed and typed data is assigned to `req.validated` and passed to the next
 * middleware. If any validation fails, it responds with a 400 status and a
 * list of `ZodError`s.
 *
 * @param {RequestValidation} validations - An object mapping request sections
 * (e.g., `body`, `query`, `params`) to their corresponding Zod schemas.
 *
 * @example
 * const validations = {
 *   body: z.object({
 *     email: z.string().email(),
 *     password: z.string().min(6)
 *   }),
 *   query: z.object({
 *     redirect: z.string().url().optional()
 *   })
 * };
 *
 * app.post('/login', zodValidate(validations), loginHandler);
 *
 * @returns Express middleware that validates request and populates `req.validated` if valid.
 *
 * @source
 */
export const validate = (validations: RequestValidation) => {
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

    res.status(StatusCodes.BAD_REQUEST).json({ errors });
  };
};
