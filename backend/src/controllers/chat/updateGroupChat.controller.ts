import { Request, Response } from "express";
import { ChatService } from "../../services/ChatService";
import { processAvatar } from "../../utils/processAvatar";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export const updateGroupChatController = async (
  req: Request,
  res: Response
) => {
  /**
   * @swagger
   * /chats/{chatId}:
   *   put:
   *     summary: Update a group chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat to update.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *             required:
   *               - name
   *     responses:
   *       201:
   *         description: Chat updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 chat:
   *                   $ref: '#/components/schemas/Chat'
   *       401:
   *         description: User not authorized to update this chat
   *       400:
   *         description: Cannot update chat of this type
   *       500:
   *         description: Server error when updating chat
   */
  try {
    const {
      name,
      token: { userId },
    } = req.body;
    const { chatId } = req.params;

    const isAuthorized = await ChatService.isUserInChat({ chatId, userId });
    if (!isAuthorized)
      return res
        .status(401)
        .json({ message: "Cannot update chat you do not belong to." });

    const oldChat = await ChatService.getChatById(chatId);
    if (!oldChat || oldChat.type !== "GROUP")
      return res
        .status(400)
        .json({ message: "cannot update chat of this type." });

    const newFilename = uuidv4();
    const file = await processAvatar(
      req.file?.path,
      ["chats", chatId],
      newFilename + ".webp"
    );

    if (oldChat.photoURL) {
      const oldFilePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "files",
        "chats",
        chatId,
        oldChat.photoURL
      );
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    }

    const chat = await ChatService.updateGroupChat({
      chatId,
      file,
      name: name || null,
    });

    return res.status(201).json({ chat });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create group chat." });
  }
};
