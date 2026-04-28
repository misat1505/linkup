import { buildValidatedResponder } from "@/utils/validatedResponder";
import { CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

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
 */
export const getSelfChatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.GET_SELF_CHATS;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const userId = req.user!.id;
    const chatService = req.app.services.chatService;

    const chats = await chatService.getUserChats(userId);

    return respond(StatusCodes.OK, {
      chats,
    });
  } catch {
    next(new Error(req.t("chats.controllers.get-self-chats.failure")));
  }
};
