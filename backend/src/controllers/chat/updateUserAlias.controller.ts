import { NextFunction, Request, Response } from "express";
import { UpdateAliasDTO } from "../../validators/chats/chats.validatotors";
import { ChatId } from "../../validators/chats/messages.validators";
import { UserId } from "../../validators/shared.validators";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to update a user's alias in a group chat.
 *
 * @remarks
 * This controller allows the user to update another user's alias in a group chat. It first checks if the user requesting the alias update is authorized to make the change. It then verifies if the user to be updated is part of the chat before proceeding with the alias update.
 *
 * @param {Request} req - The Express request object containing the alias to be updated and the necessary user/chat identifiers.
 * @param {Response} res - The Express response object used to return the updated alias details.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 *
 * @swagger
 * /chats/{chatId}/alias/{userId}:
 *   put:
 *     summary: Update a user's alias in a group chat
 *     tags: [Chats]
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: The ID of the chat where the alias will be updated.
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose alias will be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *             required:
 *               - alias
 *     responses:
 *       200:
 *         description: Alias updated successfully
 *       400:
 *         description: This user doesn't belong to this chat.
 *       403:
 *         description: User not authorized to update alias
 *       500:
 *         description: Server error when updating alias
 */
export const updateAliasController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { alias } = req.validated!.body! as UpdateAliasDTO;
    const { chatId, userId: userToUpdateId } = req.validated!.params! as Params;
    const chatService = req.app.services.chatService;

    const isUserUpdatedInChat = await chatService.isUserInChat({
      userId: userToUpdateId,
      chatId,
    });
    if (!isUserUpdatedInChat)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: req.t("chats.controllers.update-alias.user-not-in-chat"),
      });

    const isAuthorized = await chatService.isUserInChat({ userId, chatId });
    if (!isAuthorized)
      return res.status(StatusCodes.FORBIDDEN).json({
        message: req.t("chats.controllers.update-alias.unauthorized"),
      });

    await chatService.updateAlias({
      userId: userToUpdateId,
      chatId,
      alias,
    });

    return res.status(StatusCodes.OK).json({ alias });
  } catch (e) {
    next(new Error(req.t("chats.controllers.update-alias.failure")));
  }
};

const Params = ChatId.merge(UserId);
type Params = z.infer<typeof Params>;
