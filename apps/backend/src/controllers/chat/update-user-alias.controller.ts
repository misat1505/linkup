import { extractValidatedRequest } from "@/utils/extract-validated-request";
import { buildValidatedResponder } from "@/utils/validated-responder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
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
 */
export const updateAliasController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.UDPATE_USER_ALIAS;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const {
      body: { alias },
      params: { chatId, userId: userToUpdateId },
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);

    const userId = req.user!.id;
    const chatService = req.app.services.chatService;

    const isUserUpdatedInChat = await chatService.isUserInChat({
      userId: userToUpdateId,
      chatId,
    });

    if (!isUserUpdatedInChat) {
      return respond(StatusCodes.BAD_REQUEST, {
        message: req.t("chats.controllers.update-alias.user-not-in-chat"),
      });
    }

    const isAuthorized = await chatService.isUserInChat({
      userId,
      chatId,
    });

    if (!isAuthorized) {
      return respond(StatusCodes.FORBIDDEN, {
        message: req.t("chats.controllers.update-alias.unauthorized"),
      });
    }

    await chatService.updateAlias({
      userId: userToUpdateId,
      chatId,
      alias,
    });

    return respond(StatusCodes.OK, {
      alias,
    });
  } catch {
    next(new Error(req.t("chats.controllers.update-alias.failure")));
  }
};
