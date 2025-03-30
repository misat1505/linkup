import { NextFunction, Request, Response } from "express";
import { FriendshipService } from "../../services/FriendshipService";

/**
 * Controller to delete an existing friendship between two users.
 *
 * @remarks
 * This controller handles the deletion of a friendship between two users. It first validates that the user requesting the deletion is either the requester or the acceptor of the friendship. It then attempts to delete the friendship. If successful, it returns a success message. If the friendship doesn't exist or the user is not authorized to delete it, it returns an appropriate error message.
 *
 * @param {Request} req - The Express request object containing the user token and friendship details.
 * @param {Response} res - The Express response object used to send the success message or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /friendships:
 *   delete:
 *     summary: Delete an existing friendship
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
 *                 description: ID of the user who accepted the friendship request
 *                 example: "9a2e94ad-604c-46ea-b96c-44c490d1a91a"
 *     responses:
 *       200:
 *         description: Friendship deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Friendship deleted successfully."
 *       400:
 *         description: The user is not authorized to delete this friendship
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot delete friendship not belonging to you."
 *       404:
 *         description: Friendship not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Friendship not found."
 *       500:
 *         description: Server error while deleting friendship
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot delete friendship."
 */
export const deleteFriendship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.token;
    const { requesterId, acceptorId } = req.body;

    if (![requesterId, acceptorId].includes(userId))
      return res
        .status(400)
        .json({ message: req.t("friends.controllers.delete.unauthorized") });

    const isDeleted = await FriendshipService.deleteFriendship(
      requesterId,
      acceptorId
    );

    if (!isDeleted)
      return res
        .status(404)
        .json({ message: req.t("friends.controllers.delete.not-found") });

    return res
      .status(200)
      .json({ message: req.t("friends.controllers.delete.success") });
  } catch (e) {
    next(new Error(req.t("friends.controllers.delete.failure")));
  }
};
