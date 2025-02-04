import { NextFunction, Request, Response } from "express";
import { refreshTokenCookieName } from "../../config/jwt-cookie";

/**
 * Controller to log out a user by clearing the refresh token cookie.
 *
 * @remarks
 * This controller handles the logout process by clearing the refresh token stored in the user's
 * cookies. After clearing the cookie, it sends a success response. If an error occurs during
 * the logout process, an error is passed to the next middleware.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object used to send the logout status.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @throws {Error} If there is an error during the logout process, the next middleware will be called with an error.
 *
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Cannot log out
 */

export const logoutController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie(refreshTokenCookieName);
    res.status(200).json({ message: "Successfully logged out." });
  } catch (e) {
    next(new Error("Cannot log out."));
  }
};
