import { NextFunction, Request, Response } from "express";
import { CreatePrivateChatDTO } from "../../validators/chats/chats.validatotors";

/**
 * Controller to create a new private chat between two users.
 *
 * @remarks
 * This controller handles the creation of a new private chat by ensuring that the user is included in the users list.
 * It checks if the private chat between the two users already exists and creates a new chat if it doesn't.
 * The response includes the details of the created private chat.
 *
 * @param {Request} req - The Express request object containing the users' information and the user's token.
 * @param {Response} res - The Express response object used to return the created chat details.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
export const createPrivateChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { users } = req.validated!.body! as CreatePrivateChatDTO;
    const chatService = req.app.services.chatService;

    if (!users.includes(userId))
      return res.status(401).json({
        message: req.t(
          "chats.controllers.create-private-chat.not-belonging-to-you"
        ),
      });

    const chat = await chatService.getPrivateChatByUserIds(users[0], users[1]);

    if (chat) return res.status(409).json({ chat });

    const createdChat = await chatService.createPrivateChat(users[0], users[1]);

    return res.status(201).json({ chat: createdChat });
  } catch (e) {
    next(new Error(req.t("chats.controllers.create-private-chat.failure")));
  }
};
