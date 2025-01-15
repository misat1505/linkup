import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

export const updateAliasController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
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
        .json({ message: "This user doesn't belong to this chat." });

    const isAuthorized = await ChatService.isUserInChat({ userId, chatId });
    if (!isAuthorized)
      return res
        .status(401)
        .json({ message: "Cannot set aliases in chat you do not belong to." });

    await ChatService.updateAlias({ userId: userToUpdateId, chatId, alias });

    return res.status(200).json({ alias });
  } catch (e) {
    next(new Error("Cannot update alias."));
  }
};
