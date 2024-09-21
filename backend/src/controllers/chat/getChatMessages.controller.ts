import { Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

export const getChatMessagesController = async (
  req: Request,
  res: Response
) => {
  /**
   * @swagger
   * /chats/{chatId}/messages:
   *   get:
   *     summary: Get messages from a chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat from which to retrieve messages.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Messages retrieved successfully
   *       401:
   *         description: User not authorized to read messages from this chat
   *       500:
   *         description: Server error when fetching messages
   */
  try {
    const { userId } = req.body.token;
    const { chatId } = req.params;

    const isUserAuthorized = await ChatService.isUserInChat({ chatId, userId });

    if (!isUserAuthorized)
      return res
        .status(401)
        .json({ message: "You cannot read messages from this chat." });

    const messages = await ChatService.getChatMessages(chatId);

    return res.status(200).json({ messages });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get messages." });
  }
};
