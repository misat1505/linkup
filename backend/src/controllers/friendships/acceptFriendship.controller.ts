import { Request, Response } from "express";
import { FriendshipService } from "../../services/FriendshipService";

export const acceptFriendship = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /friendships/accept:
   *   post:
   *     summary: Accept an existing friendship request
   *     tags: [Friendships]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               requesterId:
   *                 type: string
   *                 description: ID of the user who sent the friendship request
   *                 example: "3b6431d2-43a4-427d-9f28-ab9001ad4f63"
   *               acceptorId:
   *                 type: string
   *                 description: ID of the user accepting the friendship request
   *                 example: "9a2e94ad-604c-46ea-b96c-44c490d1a91a"
   *     responses:
   *       200:
   *         description: Friendship accepted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 friendship:
   *                   type: object
   *                   properties:
   *                     status:
   *                       type: string
   *                       description: Current status of the friendship
   *                       example: "ACCEPTED"
   *                     requester:
   *                       description: Details of the requester user
   *                       $ref: '#/components/schemas/User'
   *                     acceptor:
   *                       description: Details of the acceptor user
   *                       $ref: '#/components/schemas/User'
   *       400:
   *         description: The acceptor ID does not match the user making the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cannot accept friendship not being meant to be accepted by you."
   *       409:
   *         description: Friendship between users does not exist
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Friendship between users doesn't exist."
   *       500:
   *         description: Server error while accepting friendship
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
    const { requesterId, acceptorId } = req.body;

    if (userId !== acceptorId)
      return res.status(400).json({
        message:
          "Cannot accept friendship not being meant to be accepted by you.",
      });

    const friendship = await FriendshipService.acceptFriendship(
      requesterId,
      acceptorId
    );

    if (!friendship)
      return res
        .status(409)
        .json({ message: "Friendship between users doesn't exist." });

    return res.status(200).json({ friendship });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get user friendships." });
  }
};
