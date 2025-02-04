import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";

/**
 * Middleware to update the last active timestamp for the user.
 *
 * This middleware retrieves the `userId` from the decoded JWT token (attached to `req.body.token`),
 * and calls `UserService.updateLastActive` to update the user's last active timestamp in the database.
 * After updating the last active timestamp, it passes control to the next middleware or route handler.
 *
 * @example
 * // Usage:
 * app.use(updateLastActive); // Apply to routes that require tracking last active time.
 *
 * @source
 */
export const updateLastActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body.token;

  await UserService.updateLastActive(userId);

  next();
};
