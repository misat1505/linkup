import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

/**
 * Controller to update a user's alias in a group chat.
 *
 * @remarks
 * This controller allows the user to update another user's alias in a group chat. It first checks if the user requesting the alias update is authorized to make the change. It then verifies if the user to be updated is part of the chat before proceeding with the alias update.
 *
 * @param {Request} req - The Express request object containing the alias to be updated and the necessary user/chat identifiers.
 * @param {Response} res - The Express response object used to return the updated alias details.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /chats/{chatId}/alias/{userId}:
 *   put:
 *     summary: Update a user's alias in a group chat
 *     tags: [Chats]
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: The ID of the chat where the alias will be updated.
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose alias will be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *             required:
 *               - alias
 *     responses:
 *       200:
 *         description: Alias updated successfully
 *       401:
 *         description: User not authorized to update alias
 *       500:
 *         description: Server error when updating alias
 */
export const updateAliasController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      token: { userId },
      alias,
    } = req.body;
    const { chatId, userId: userToUpdateId } = req.params;

    const isUserUpdatedInChat = await ChatService.isUserInChat({
      userId: userToUpdateId,
      chatId,
    });
    if (!isUserUpdatedInChat)
      return res
        .status(401)
        .json({
          message: req.t("chats.controllers.update-alias.user-not-in-chat"),
        });

    const isAuthorized = await ChatService.isUserInChat({ userId, chatId });
    if (!isAuthorized)
      return res
        .status(401)
        .json({
          message: req.t("chats.controllers.update-alias.unauthorized"),
        });

    await ChatService.updateAlias({ userId: userToUpdateId, chatId, alias });

    return res.status(200).json({ alias });
  } catch (e) {
    next(new Error(req.t("chats.controllers.update-alias.failure")));
  }
};
