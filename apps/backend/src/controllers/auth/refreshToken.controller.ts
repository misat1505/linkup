import { env } from "@/config/env";
import {
  accessTokenSignOptions,
  refreshTokenCookieName,
  refreshTokenCookieOptions,
  refreshTokenSignOptions,
} from "@/config/jwt-cookie";
import { TokenProcessor } from "@/lib/TokenProcessor";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to refresh the access token and refresh token using the provided refresh token.
 *
 * @remarks
 * This controller reads the refresh token from the request to authenticate the user. It then
 * generates and returns a new access token and refresh token. The new refresh token is stored in a
 * cookie, and both tokens are returned in the response.
 *
 * @param {Request} req - The Express request object that contains the user's refresh token.
 * @param {Response} res - The Express response object used to send the refreshed tokens.
 * @param {NextFunction} next - The Express next function for error handling.
 *
 * @source
 */
export const refreshTokenController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;

    const refreshToken = TokenProcessor.encode(
      { userId },
      env.REFRESH_TOKEN_SECRET,
      refreshTokenSignOptions,
    );
    const accessToken = TokenProcessor.encode(
      { userId },
      env.ACCESS_TOKEN_SECRET,
      accessTokenSignOptions,
    );
    res.cookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions);
    return res.status(StatusCodes.OK).json({
      message: req.t("auth.controllers.refresh.success"),
      accessToken,
    });
  } catch {
    next(new Error(req.t("auth.controllers.refresh.failure")));
  }
};
