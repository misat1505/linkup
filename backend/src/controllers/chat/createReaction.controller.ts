import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

/**
 * Controller to create a reaction to a message in a chat.
 *
 * @remarks
 * This controller handles creating a reaction to a message within a chat. It ensures that the user is part of the chat and that the message exists within the specified chat. If both conditions are met, the reaction is created and returned in the response.
 *
 * @param {Request} req - The Express request object containing the reaction details and the user's token.
 * @param {Response} res - The Express response object used to return the created reaction.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /chats/{chatId}/reactions:
 *   post:
 *     summary: Create a reaction to a message in a chat
 *     tags: [Chats]
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: The ID of the chat where the message exists.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reactionId:
 *                 type: string
 *               messageId:
 *                 type: string
 *             required:
 *               - reactionId
 *               - messageId
 *     responses:
 *       201:
 *         description: Reaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reaction:
 *                   $ref: '#/components/schemas/Reaction'
 *       401:
 *         description: User not authorized to create reaction
 *       500:
 *         description: Server error when creating reaction
 */
export const createReactionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      token: { userId },
      reactionId,
      messageId,
    } = req.body;
    const { chatId } = req.params;

    const isUserAuthorized = await ChatService.isUserInChat({ chatId, userId });

    if (!isUserAuthorized)
      return res.status(401).json({
        message: "You cannot create reaction in chat not belonging to you.",
      });

    const isMessageInChat = await ChatService.isMessageInChat({
      chatId,
      messageId,
    });

    if (!isMessageInChat)
      return res.status(401).json({
        message:
          "Cannot create reaction to a message that is not in given chat.",
      });

    const reaction = await ChatService.createReactionToMessage({
      userId,
      reactionId,
      messageId,
    });

    return res.status(201).json({ reaction });
  } catch (e) {
    next(new Error("Cannot create reaction."));
  }
};
