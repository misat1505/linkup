import { NextFunction, Request, Response } from "express";
import { refreshTokenCookieName } from "../../config/jwt-cookie";

export const logoutController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
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
  try {
    res.clearCookie(refreshTokenCookieName);
    res.status(200).json({ message: "Successfully logged out." });
  } catch (e) {
    next(new Error("Cannot log out."));
  }
};
