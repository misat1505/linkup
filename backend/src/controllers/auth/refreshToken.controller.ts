import { NextFunction, Request, Response } from "express";
import { TokenProcessor } from "../../lib/TokenProcessor";
import {
  accessTokenSignOptions,
  refreshTokenCookieName,
  refreshTokenCookieOptions,
  refreshTokenSignOptions,
} from "../../config/jwt-cookie";
import { env } from "../../config/env";
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
 *
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token and refresh token
 *     description: This endpoint reads the refresh token from the request to authorize the user and generate a new access token.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       500:
 *         description: Cannot refresh token
 */
export const refreshTokenController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;

    const refreshToken = TokenProcessor.encode(
      { userId },
      env.REFRESH_TOKEN_SECRET,
      refreshTokenSignOptions
    );
    const accessToken = TokenProcessor.encode(
      { userId },
      env.ACCESS_TOKEN_SECRET,
      accessTokenSignOptions
    );
    res.cookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions);
    return res.status(StatusCodes.OK).json({
      message: req.t("auth.controllers.refresh.success"),
      accessToken,
    });
  } catch (e) {
    next(new Error(req.t("auth.controllers.refresh.failure")));
  }
};
