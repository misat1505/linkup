import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";
import { Message } from "../../types/Message";

/**
 * Controller to retrieve messages from a chat.
 *
 * @remarks
 * This controller handles the process of fetching messages from a specified chat. It checks if the user is authorized to read messages from the chat, processes the optional response ID, and retrieves the messages from the chat.
 *
 * @param {Request} req - The Express request object containing the chat ID, user's token, and optional response ID query parameter.
 * @param {Response} res - The Express response object used to return the retrieved messages.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
export const getChatMessagesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.token;
    const { chatId } = req.params;
    const { responseId, lastMessageId, limit } = req.query;

    const isUserAuthorized = await ChatService.isUserInChat({ chatId, userId });

    if (!isUserAuthorized)
      return res.status(401).json({
        message: req.t("chats.controllers.get-messages.unauthorized"),
      });

    const serviceFunction =
      responseId !== undefined
        ? () =>
            ChatService.getPostChatMessages(
              chatId,
              processResponseId(responseId)
            )
        : () =>
            ChatService.getChatMessages(
              chatId,
              processLastMessageId(lastMessageId),
              processLimit(limit)
            );

    const messages = await serviceFunction();

    return res.status(200).json({ messages });
  } catch (e) {
    next(new Error(req.t("chats.controllers.get-messages.failure")));
  }
};

const processResponseId = (responseId: any): string | null => {
  if (responseId === "null") {
    return null;
  }
  if (typeof responseId === "string") {
    return responseId;
  }
  throw new Error("ResponseId has to be a string");
};

const processLastMessageId = (
  lastMessageId: any
): Message["id"] | undefined => {
  if (!lastMessageId) return undefined;
  if (typeof lastMessageId !== "string")
    throw new Error("lastMessageId has to be a string");
  return lastMessageId;
};

const processLimit = (limit: any): number | undefined => {
  if (!limit) return 10;
  const parsed = parseInt(limit);
  if (isNaN(parsed)) throw new Error("Limit has to be a number");
  return parsed;
};
