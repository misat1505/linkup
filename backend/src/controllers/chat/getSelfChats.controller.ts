import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/ChatService";

/**
 * Controller to retrieve all chats for a user.
 *
 * @remarks
 * This controller fetches and returns all the chats associated with a specific user. It extracts the user ID from the request body, fetches the user's chats, and returns them in the response.
 *
 * @param {Request} req - The Express request object containing the user's token to identify the user.
 * @param {Response} res - The Express response object used to return the list of chats.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
export const getSelfChatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body.token;

    const chats = await ChatService.getUserChats(userId);

    return res.status(200).json({ chats });
  } catch (e) {
    next(new Error("Cannot get user's chats."));
  }
};
