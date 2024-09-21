import { Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

export const addUserToGroupChatController = async (
  req: Request,
  res: Response
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

    const chatType = await ChatService.getChatType(chatId);
    if (chatType !== "GROUP")
      return res
        .status(401)
        .json({ message: "Cannot add people to chat of this type." });

    const iAmInChat = await ChatService.isUserInChat({ userId: myId, chatId });
    if (!iAmInChat)
      return res.status(401).json({
        message: "Cannot add users to chat to which you do not belong to.",
      });

    const isOtherInChat = await ChatService.isUserInChat({ userId, chatId });
    if (isOtherInChat)
      return res.status(409).json({ message: "User is already in this chat." });

    const user = await ChatService.addUserToChat({ chatId, userId });
    return res.status(201).json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Cannot add user to this chat." });
  }
};
