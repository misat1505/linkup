import { NextFunction, Request, Response } from "express";
import { processAvatar } from "../../utils/processAvatar";
import { v4 as uuidv4 } from "uuid";
import { CreateGroupChatDTO } from "../../validators/chats/chats.validatotors";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to create a new group chat.
 *
 * @remarks
 * This controller handles the creation of a new group chat. It ensures the current user is part of the users list
 * for the group chat, processes an avatar if provided, and calls the service to create the group chat.
 * If a file (avatar) is uploaded, it is processed and saved.
 *
 * @param {Request} req - The Express request object containing the list of users and chat name.
 * @param {Response} res - The Express response object used to return the created chat details.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
 *       400:
 *         description: User not authorized to create group chat
 *       500:
 *         description: Server error when creating group chat
 */
export const createGroupChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { users, name } = req.validated!.body! as CreateGroupChatDTO;
    const { chatService, fileStorage } = req.app.services;

    if (!users.includes(userId))
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: req.t(
          "chats.controllers.create-group-chat.not-belonging-to-you"
        ),
      });

    const newFilename = req.file ? uuidv4() + ".webp" : null;

    const chat = await chatService.createGroupChat(
      users,
      name || null,
      newFilename
    );

    if (newFilename)
      await processAvatar(
        fileStorage,
        req.file,
        `chats/${chat.id}/`,
        newFilename
      );

    return res.status(StatusCodes.CREATED).json({ chat });
  } catch (e) {
    next(new Error(req.t("chats.controllers.create-group-chat.failure")));
  }
};
