import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { processAvatar } from "@/utils/processAvatar";
import { API_CONTRACT } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

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
 */
export const updateGroupChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      body: { name },
      params: { chatId },
    } = extractValidatedRequest(req, API_CONTRACT.UPDATE_GROUP_CHAT);
    const userId = req.user!.id;
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
      newFilename + ".webp",
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
  } catch {
    next(new Error(req.t("chats.controllers.update-group-chat.failure")));
  }
};
