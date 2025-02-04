import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";
import { generateNewFilename } from "../../utils/generateNewFilename";
import fileStorage from "../../lib/FileStorage";

/**
 * Controller to create a new message in a chat.
 *
 * @remarks
 * This controller handles the creation of a new message in a specified chat. It checks if the user is authorized
 * to send the message and if the response message exists when provided. It also handles the uploading of files
 * associated with the message and stores them in the appropriate directory.
 *
 * @param {Request} req - The Express request object containing the chat ID, message content, and optionally, the response ID and files.
 * @param {Response} res - The Express response object used to return the created message details.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /chats/{chatId}/messages:
 *   post:
 *     summary: Create a new message in a chat
 *     tags: [Chats]
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: The ID of the chat where the message will be sent.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               responseId:
 *                 type: string
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: '#/components/schemas/Message'
 *       401:
 *         description: User not authorized to send a message
 *       400:
 *         description: Response message does not exist in this chat
 *       500:
 *         description: Server error when creating message
 */
export const createMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, responseId } = req.body;
    const { userId } = req.body.token;
    const { chatId } = req.params;
    const files = req.files as Express.Multer.File[];

    const checks = [ChatService.isUserInChat({ chatId, userId })];

    if (responseId) {
      checks.push(
        ChatService.isMessageInChat({
          chatId,
          messageId: responseId,
        })
      );
    }

    const [isUserAuthorized, isResponseInChat] = await Promise.all(checks);

    if (!isUserAuthorized) {
      return res
        .status(401)
        .json({ message: "You cannot send a message to this chat." });
    }

    if (responseId && !isResponseInChat) {
      return res.status(400).json({
        message: "Message of this responseId does not exist in this chat.",
      });
    }

    const filenames = await Promise.all(
      files.map(async (file) => {
        const name = generateNewFilename(file.originalname);
        const key = `chats/${chatId}/${name}`;
        await fileStorage.uploadFile(file.buffer, file.mimetype, key);
        return name;
      })
    );

    const message = await ChatService.createMessage({
      content,
      authorId: userId,
      chatId,
      files: filenames,
      responseId,
    });

    return res.status(201).json({ message });
  } catch (e) {
    next(new Error("Cannot create message."));
  }
};
