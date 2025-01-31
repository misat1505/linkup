import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

/**
 * Controller to remove a user from a group chat.
 *
 * @remarks
 * This controller handles the process of a user removing themselves from a group chat. It checks if the chat is a group chat, ensures the user is part of the chat, and then removes them from the chat.
 *
 * @param {Request} req - The Express request object containing the chat ID and the user's token.
 * @param {Response} res - The Express response object used to return a success message after the user is removed from the chat.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /chats/{chatId}/users:
 *   delete:
 *     summary: Remove a user from a group chat
 *     tags: [Chats]
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: The ID of the chat from which to remove the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted from chat
 *       401:
 *         description: User not authorized to remove from this chat
 *       500:
 *         description: Server error when removing user from chat
 */
export const deleteSelfFromGroupChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const {
      token: { userId },
    } = req.body;

    const chatType = await ChatService.getChatType(chatId);
    if (chatType !== "GROUP")
      return res
        .status(401)
        .json({ message: "Cannot remove yourself from chat of this type." });

    const iAmInChat = await ChatService.isUserInChat({ userId, chatId });
    if (!iAmInChat)
      return res.status(401).json({
        message: "Cannot remove yourself from chat which you do not belong to.",
      });

    await ChatService.deleteFromChat({ chatId, userId });
    return res.status(200).json({ message: "Successfully deleted from chat." });
  } catch (e) {
    next(new Error("Cannot add user to this chat."));
  }
};
