import { NextFunction, Request, Response } from "express";
import { FriendshipService } from "../../services/FriendshipService";

/**
 * Controller to accept an existing friendship request.
 *
 * @remarks
 * This controller handles the logic of accepting a pending friendship request. It validates that the user making the request is the one intended to accept the friendship, checks if the friendship exists, and updates the friendship status accordingly. If successful, it returns the updated friendship object; otherwise, it returns an error message depending on the issue (e.g., invalid user, non-existing friendship).
 *
 * @param {Request} req - The Express request object containing the user token and friendship details.
 * @param {Response} res - The Express response object used to send the success message or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
export const acceptFriendship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.token;
    const { requesterId, acceptorId } = req.body;

    if (userId !== acceptorId)
      return res.status(400).json({
        message: req.t("friends.controllers.accept.unauthorized"),
      });

    const friendship = await FriendshipService.acceptFriendship(
      requesterId,
      acceptorId
    );

    if (!friendship)
      return res
        .status(409)
        .json({ message: req.t("friends.controllers.accept.not-found") });

    return res.status(200).json({ friendship });
  } catch (e) {
    next(new Error(req.t("friends.controllers.accept.failure")));
  }
};
