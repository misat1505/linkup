import { NextFunction, Request, Response } from "express";
import { UserService } from "../../services/UserService";

export const getSelfController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * @swagger
   * /auth/user:
   *   get:
   *     summary: Get current user details
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: User fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
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

    return res.status(200).json({ user: UserService.removeCredentials(user) });
  } catch (e) {
    next(new Error("Cannot fetch user."));
  }
};
