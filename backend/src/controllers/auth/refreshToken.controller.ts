import { Request, Response } from "express";
import { JwtHandler } from "../../lib/JwtHandler";
import { jwtCookieOptions } from "../../config/jwt-cookie";

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

    const jwt = JwtHandler.encode({ userId }, { expiresIn: "1h" });
    const accessToken = JwtHandler.encode({ userId }, { expiresIn: "1h" });
    res.cookie("token", jwt, jwtCookieOptions);
    return res
      .status(200)
      .json({ message: "Successfully refreshed token.", accessToken });
  } catch (e) {
    return res.status(500).json({ message: "Cannot refresh token." });
  }
};
