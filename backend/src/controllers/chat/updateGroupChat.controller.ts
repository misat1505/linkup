import { NextFunction, Request, Response } from "express";
import { processAvatar } from "@/utils/processAvatar";
import { v4 as uuidv4 } from "uuid";
import { UpdateGroupChatDTO } from "@/validators/chats/chats.validatotors";
import { ChatId } from "@/validators/chats/messages.validators";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to update a group chat's name and avatar.
 *
 * @remarks
 * This controller allows the user to update a group chat's name and avatar. It first checks if the user is authorized to update the chat. Then, it processes the new avatar file (if provided) and updates the chat details.
 *
 * @param {Request} req - The Express request object containing the new name for the chat and the avatar file (if any).
 * @param {Response} res - The Express response object used to return the updated chat details.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
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
 *       200:
 *         description: Chat updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chat:
 *                   $ref: '#/components/schemas/Chat'
 *       403:
 *         description: User not authorized to update this chat
 *       400:
 *         description: Cannot update chat of this type
 *       500:
 *         description: Server error when updating chat
 */
export const updateGroupChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { name } = req.validated!.body! as UpdateGroupChatDTO;
    const { chatId } = req.validated!.params! as ChatId;
    const { chatService, fileStorage } = req.app.services;

    const isAuthorized = await chatService.isUserInChat({ chatId, userId });
    if (!isAuthorized)
      return res.status(StatusCodes.FORBIDDEN).json({
        message: req.t("chats.controllers.update-group-chat.unauthorized"),
      });

    const oldChat = await chatService.getChatById(chatId);
    if (!oldChat || oldChat.type !== "GROUP")
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: req.t("chats.controllers.update-group-chat.bad-type"),
      });

    const newFilename = uuidv4();
    const file = await processAvatar(
      fileStorage,
      req.file,
      `chats/${chatId}/`,
      newFilename + ".webp"
    );

    if (oldChat.photoURL) {
      await fileStorage.deleteFile(`chats/${chatId}/${oldChat.photoURL}`);
    }

    const chat = await chatService.updateGroupChat({
      chatId,
      file,
      name: name || null,
    });

    return res.status(StatusCodes.OK).json({ chat });
  } catch (e) {
    next(new Error(req.t("chats.controllers.update-group-chat.failure")));
  }
};
