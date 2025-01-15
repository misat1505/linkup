import { NextFunction, Request, Response } from "express";
import { FriendshipService } from "../../services/FriendshipService";

export const getUserFriendships = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * @swagger
   * /friendships:
   *   get:
   *     summary: Retrieve a list of user friendships
   *     tags: [Friendships]
   *     responses:
   *       200:
   *         description: Friendships retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 friendships:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       status:
   *                         type: string
   *                         description: Current status of the friendship
   *                         example: "ACCEPTED"
   *                       requester:
   *                         description: Details of the requester user
   *                         $ref: '#/components/schemas/User'
   *                       acceptor:
   *                         description: Details of the acceptor user
   *                         $ref: '#/components/schemas/User'
   *       500:
   *         description: Cannot retrieve user friendships due to a server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cannot get user friendships."
   */
  try {
    const { userId } = req.body.token;

    const friendships = await FriendshipService.getUserFriendships(userId);

    return res.status(200).json({ friendships });
  } catch (e) {
    next(new Error("Cannot get user friendships."));
  }
};
