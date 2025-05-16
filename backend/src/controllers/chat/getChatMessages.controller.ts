import { NextFunction, Request, Response } from "express";
import { Message } from "@/types/Message";
import {
  ChatId,
  GetMessagesQuery,
} from "@/validators/chats/messages.validators";
import { StatusCodes } from "http-status-codes";

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
 *       - name: responseId
 *         in: query
 *         required: false
 *         description: The ID of the response message to filter messages by. If provided, only messages responding to the given response ID are returned.
 *         schema:
 *           type: string
 *       - name: lastMessageId
 *         in: query
 *         required: false
 *         description: The ID of the last message to use for pagination. If provided, messages after the given message ID will be returned.
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         required: false
 *         description: The maximum number of messages to retrieve. Defaults to 10 if not provided. Maximum value is 10.
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 10
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
 *       403:
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
    const userId = req.user!.id;
    const { chatId } = req.validated!.params! as ChatId;
    const query = req.validated!.query! as GetMessagesQuery;
    const chatService = req.app.services.chatService;

    const isUserAuthorized = await chatService.isUserInChat({ chatId, userId });

    if (!isUserAuthorized)
      return res.status(StatusCodes.FORBIDDEN).json({
        message: req.t("chats.controllers.get-messages.unauthorized"),
      });

    let messages: Message[];

    if ("responseId" in query) {
      messages = await chatService.getPostChatMessages(
        chatId,
        query.responseId
      );
    } else {
      messages = await chatService.getChatMessages(
        chatId,
        query.lastMessageId ?? undefined,
        query.limit
      );
    }

    return res.status(StatusCodes.OK).json({ messages });
  } catch (e) {
    next(new Error(req.t("chats.controllers.get-messages.failure")));
  }
};
