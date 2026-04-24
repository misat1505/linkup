import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to create a reaction to a message in a chat.
 *
 * @remarks
 * This controller handles creating a reaction to a message within a chat. It ensures that the user is part of the chat and that the message exists within the specified chat. If both conditions are met, the reaction is created and returned in the response.
 *
 * @param {Request} req - The Express request object containing the reaction details and the user's token.
 * @param {Response} res - The Express response object used to return the created reaction.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const createReactionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.CREATE_REACTION;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const {
      body: { messageId, reactionId },
      params: { chatId },
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);

    const userId = req.user!.id;
    const chatService = req.app.services.chatService;

    const isUserAuthorized = await chatService.isUserInChat({
      chatId,
      userId,
    });

    if (!isUserAuthorized) {
      return respond(StatusCodes.FORBIDDEN, {
        message: req.t("chats.controllers.create-reaction.bad-chat"),
      });
    }

    const isMessageInChat = await chatService.isMessageInChat({
      chatId,
      messageId,
    });

    if (!isMessageInChat) {
      return respond(StatusCodes.BAD_REQUEST, {
        message: req.t("chats.controllers.create-reaction.bad-message"),
      });
    }

    const reaction = await chatService.createReactionToMessage({
      userId,
      reactionId,
      messageId,
    });

    return respond(StatusCodes.CREATED, {
      reaction,
    });
  } catch {
    next(new Error(req.t("chats.controllers.create-reaction.failure")));
  }
};
