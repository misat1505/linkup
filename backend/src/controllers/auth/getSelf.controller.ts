import { Request, Response } from "express";
import { UserService } from "../../services/UserService";
import { TokenProcessor } from "../../lib/TokenProcessor";
import { jwtCookieOptions } from "../../config/jwt-cookie";

export const getSelfController = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /auth/user:
   *   get:
   *     summary: Get current user details
   *     description: This endpoint reads the refresh token from the request to authorize the user and generate a new access token.
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: User fetched successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Cannot fetch user
   */
  try {
    const userId = req.body.token.userId;

    const user = await UserService.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const jwt = TokenProcessor.encode({ userId: user.id }, { expiresIn: "1h" });
    const accessToken = TokenProcessor.encode(
      { userId: user.id },
      { expiresIn: "1h" }
    );
    res.cookie("token", jwt, jwtCookieOptions);
    return res
      .status(200)
      .json({ user: UserService.removeCredentials(user), accessToken });
  } catch (e) {
    return res.status(500).json({ message: "Cannot fetch user." });
  }
};
