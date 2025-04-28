import { NextFunction, Request, Response } from "express";

/**
 * Controller to create a new friendship request between two users.
 *
 * @remarks
 * This controller handles the creation of a friendship between two users. It validates that the user making the request is the one initiating the friendship, checks if the friendship already exists, and creates the friendship if possible. If successful, it returns the newly created friendship object; otherwise, it returns an error message depending on the issue (e.g., user mismatch, existing friendship).
 *
 * @param {Request} req - The Express request object containing the user token and friendship details.
 * @param {Response} res - The Express response object used to send the success message or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
 *                   example: "Cannot create friendship."
 */
export const createFriendship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.token;
    const { requesterId, acceptorId } = req.body;
    const friendshipService = req.app.services.friendshipService;

    if (userId !== requesterId)
      return res
        .status(400)
        .json({ message: req.t("friends.controllers.create.unauthorized") });

    const friendship = await friendshipService.createFriendship(
      requesterId,
      acceptorId
    );

    if (!friendship)
      return res
        .status(409)
        .json({ message: req.t("friends.controllers.create.already-exists") });

    return res.status(201).json({ friendship });
  } catch (e) {
    next(new Error(req.t("friends.controllers.create.failure")));
  }
};
