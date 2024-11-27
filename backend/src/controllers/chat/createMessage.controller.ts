import { Request, Response } from "express";
import { ChatService } from "../../services/ChatService";
import path from "path";
import fs from "fs";

export const createMessageController = async (req: Request, res: Response) => {
  /**
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
  try {
    const { content, responseId } = req.body;
    const { userId } = req.body.token;
    const { chatId } = req.params;
    const files = (req.files as Express.Multer.File[]).map(
      (file) => file.filename
    );

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

    files.forEach((file) => {
      const commonPath = path.join(__dirname, "..", "..", "..", "files");
      const inPath = path.join(commonPath, "temp", file);
      const outPath = path.join(commonPath, "chats", chatId, file);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.copyFileSync(inPath, outPath);
      fs.unlinkSync(inPath);
    });

    const message = await ChatService.createMessage({
      content,
      authorId: userId,
      chatId,
      files,
      responseId,
    });

    return res.status(201).json({ message });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Cannot create message." });
  }
};
