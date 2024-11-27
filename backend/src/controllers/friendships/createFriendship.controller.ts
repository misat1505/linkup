import { Request, Response } from "express";
import { FriendshipService } from "../../services/FriendshipService";

export const createFriendship = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /friendships:
   *   post:
   *     summary: Create a new friendship
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
   *                 description: ID of the user requesting the friendship
   *                 example: "3b6431d2-43a4-427d-9f28-ab9001ad4f63"
   *               acceptorId:
   *                 type: string
   *                 description: ID of the user accepting the friendship request
   *                 example: "9a2e94ad-604c-46ea-b96c-44c490d1a91a"
   *     responses:
   *       200:
   *         description: Friendship created successfully
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
   *                       example: "PENDING"
   *                     requester:
   *                       description: Details of the requester user
   *                       $ref: '#/components/schemas/User'
   *                     acceptor:
   *                       description: Details of the acceptor user
   *                       $ref: '#/components/schemas/User'
   *       400:
   *         description: The requester ID does not match the user making the request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cannot create friendship not requested by you."
   *       409:
   *         description: Friendship already exists between users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Friendship already exists between users."
   *       500:
   *         description: Server error while creating friendship
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

    if (userId !== requesterId)
      return res
        .status(400)
        .json({ message: "Cannot create friendship not requested by you." });

    const friendship = await FriendshipService.createFriendship(
      requesterId,
      acceptorId
    );

    if (!friendship)
      return res
        .status(409)
        .json({ message: "Friendship already exists between users." });

    return res.status(200).json({ friendship });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get user friendships." });
  }
};
