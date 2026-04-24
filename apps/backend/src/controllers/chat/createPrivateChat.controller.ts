import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

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
 */
export const createPrivateChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.CREATE_PRIVATE_CHAT;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const userId = req.user!.id;

    const {
      body: { users },
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);

    const chatService = req.app.services.chatService;

    if (!users.includes(userId)) {
      return respond(StatusCodes.BAD_REQUEST, {
        message: req.t(
          "chats.controllers.create-private-chat.not-belonging-to-you",
        ),
      });
    }

    const chat = await chatService.getPrivateChatByUserIds(users[0], users[1]);

    if (chat) {
      return respond(StatusCodes.CONFLICT, { chat });
    }

    const createdChat = await chatService.createPrivateChat(users[0], users[1]);

    return respond(StatusCodes.CREATED, { chat: createdChat });
  } catch {
    next(new Error(req.t("chats.controllers.create-private-chat.failure")));
  }
};
