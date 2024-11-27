import { Request, Response } from "express";
import { ChatService } from "../../services/ChatService";
import { processAvatar } from "../../utils/processAvatar";
import { v4 as uuidv4 } from "uuid";

export const createGroupChatController = async (
  req: Request,
  res: Response
) => {
  /**
   * @swagger
   * /chats/group:
   *   post:
   *     summary: Create a new group chat
   *     tags: [Chats]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               users:
   *                 type: array
   *                 items:
   *                   type: string
   *               name:
   *                 type: string
   *             required:
   *               - users
   *               - name
   *     responses:
   *       201:
   *         description: Group chat created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 chat:
   *                   $ref: '#/components/schemas/Chat'
   *       401:
   *         description: User not authorized to create group chat
   *       500:
   *         description: Server error when creating group chat
   */
  try {
    const {
      users,
      name,
      token: { userId },
    } = req.body;
    if (!users.includes(userId))
      return res
        .status(401)
        .json({ message: "Cannot create group chat not belonging to you." });

    const originalPath = req.file?.path || null;
    const newFilename = originalPath ? uuidv4() + ".webp" : null;
    const chat = await ChatService.createGroupChat(
      users,
      name || null,
      newFilename
    );

    if (newFilename)
      await processAvatar(req.file?.path, ["chats", chat.id], newFilename);

    return res.status(201).json({ chat });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create group chat." });
  }
};
