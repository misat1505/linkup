import { Request, Response } from "express";
import { TokenProcessor } from "../../lib/TokenProcessor";
import {
  accessTokenSignOptions,
  refreshTokenCookieName,
  refreshTokenCookieOptions,
  refreshTokenSignOptions,
} from "../../config/jwt-cookie";
import { env } from "../../config/env";

export const refreshTokenController = (req: Request, res: Response) => {
  /**
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
  try {
    const { userId } = req.body.token;

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
    return res
      .status(200)
      .json({ message: "Successfully refreshed token.", accessToken });
  } catch (e) {
    return res.status(500).json({ message: "Cannot refresh token." });
  }
};
