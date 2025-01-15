import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

export const addUserToGroupChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * @swagger
   * /chats/{chatId}/users:
   *   post:
   *     summary: Add a user to a group chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat to which to add the user.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *             required:
   *               - userId
   *     responses:
   *       201:
   *         description: User added to chat successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: User not authorized to add to this chat
   *       409:
   *         description: User is already in this chat
   *       500:
   *         description: Server error when adding user to chat
   */
  try {
    const { chatId } = req.params;
    const {
      token: { userId: myId },
      userId,
    } = req.body;

    const [chatType, iAmInChat, isOtherInChat] = await Promise.all([
      ChatService.getChatType(chatId),
      ChatService.isUserInChat({ userId: myId, chatId }),
      ChatService.isUserInChat({ userId, chatId }),
    ]);

    if (chatType !== "GROUP")
      return res
        .status(401)
        .json({ message: "Cannot add people to chat of this type." });

    if (!iAmInChat)
      return res.status(401).json({
        message: "Cannot add users to chat to which you do not belong to.",
      });

    if (isOtherInChat)
      return res.status(409).json({ message: "User is already in this chat." });

    const user = await ChatService.addUserToChat({ chatId, userId });
    return res.status(201).json({ user });
  } catch (e) {
    next(new Error("Cannot add user to this chat."));
  }
};
