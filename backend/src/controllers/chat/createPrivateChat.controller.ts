import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

export const createPrivateChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * @swagger
   * /chats/private:
   *   post:
   *     summary: Create a new private chat
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
   *             required:
   *               - users
   *     responses:
   *       201:
   *         description: Private chat created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 chat:
   *                   $ref: '#/components/schemas/Chat'
   *       409:
   *         description: Chat already exists
   *       401:
   *         description: User not authorized to create private chat
   *       500:
   *         description: Server error when creating private chat
   */
  try {
    const {
      users,
      token: { userId },
    } = req.body;

    if (!users.includes(userId))
      return res
        .status(401)
        .json({ message: "Cannot create private chat not belonging to you." });

    const chat = await ChatService.getPrivateChatByUserIds(users[0], users[1]);

    if (chat) return res.status(409).json({ chat });

    const createdChat = await ChatService.createPrivateChat(users[0], users[1]);

    return res.status(201).json({ chat: createdChat });
  } catch (e) {
    next(new Error("Cannot create private chat."));
  }
};
