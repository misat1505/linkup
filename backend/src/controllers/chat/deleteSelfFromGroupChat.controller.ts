import { Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

export const deleteSelfFromGroupChatController = async (
  req: Request,
  res: Response
) => {
  /**
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
    return res.status(500).json({ message: "Cannot add user to this chat." });
  }
};
