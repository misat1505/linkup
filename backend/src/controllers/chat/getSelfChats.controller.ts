import { Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

export const getSelfChatsController = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /chats:
   *   get:
   *     summary: Get all chats for a user
   *     tags: [Chats]
   *     responses:
   *       200:
   *         description: Chats retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 chats:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Chat'
   *       500:
   *         description: Server error when fetching user's chats
   */
  try {
    const { userId } = req.body.token;

    const chats = await ChatService.getUserChats(userId);

    return res.status(200).json({ chats });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get user's chats." });
  }
};
