import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

export const getChatMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
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
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 messages:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Message'
   *       401:
   *         description: User not authorized to read messages from this chat
   *       500:
   *         description: Server error when fetching messages
   */
  try {
    const { userId } = req.body.token;
    const { chatId } = req.params;
    const { responseId } = req.query;

    const isUserAuthorized = await ChatService.isUserInChat({ chatId, userId });

    if (!isUserAuthorized)
      return res
        .status(401)
        .json({ message: "You cannot read messages from this chat." });

    const messages = await ChatService.getChatMessages(
      chatId,
      processResponseId(responseId)
    );

    return res.status(200).json({ messages });
  } catch (e) {
    next(new Error("Cannot get messages."));
  }
};

const processResponseId = (responseId: any): string | null | undefined => {
  if (responseId === "null") {
    return null;
  }
  if (typeof responseId === "string") {
    return responseId;
  }
  return undefined;
};
