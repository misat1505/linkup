import { refreshTokenCookieName } from "@/config/jwt-cookie";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

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
 */

export const logoutController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.LOGOUT;
  const respond = buildValidatedResponder(res, contractKey);
  try {
    res.clearCookie(refreshTokenCookieName);

    return respond(StatusCodes.OK, {
      message: req.t("auth.controllers.logout.success"),
    });
  } catch {
    next(new Error(req.t("auth.controllers.logout.failure")));
  }
};
