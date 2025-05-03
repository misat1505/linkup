import { NextFunction, Request, Response } from "express";

/**
 * Middleware to update the last active timestamp for the user.
 *
 * This middleware retrieves the `userId` from the decoded JWT token (attached to `req.user`),
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
  const userId = req.user!.id;
  const userService = req.app.services.userService;

  await userService.updateLastActive(userId);

  next();
};
