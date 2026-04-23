import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { API_CONTRACT } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to add a user to a group chat.
 *
 * @remarks
 * This controller allows a user to add another user to a group chat. It checks if the current user is authorized
 * to add members, if the chat is of the "GROUP" type, and if the user is already in the chat. If any conditions
 * are not met, an appropriate error message is returned.
 *
 * @param {Request} req - The Express request object containing the chat ID and the user ID to add.
 * @param {Response} res - The Express response object used to return the added user details.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const addUserToGroupChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const chatService = req.app.services.chatService;
    const {
      params: { chatId },
      body: { userId },
    } = extractValidatedRequest(req, API_CONTRACT.ADD_USER_TO_GROUP_CHAT);
    const myId = req.user!.id;

    const [chatType, iAmInChat, isOtherInChat] = await Promise.all([
      chatService.getChatType(chatId),
      chatService.isUserInChat({ userId: myId, chatId }),
      chatService.isUserInChat({ userId, chatId }),
    ]);

    if (chatType !== "GROUP")
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: req.t(
          "chats.controllers.add-user-to-group-chat.bad-chat-type",
        ),
      });

    if (!iAmInChat)
      return res.status(StatusCodes.FORBIDDEN).json({
        message: req.t(
          "chats.controllers.add-user-to-group-chat.i-am-not-in-chat",
        ),
      });

    if (isOtherInChat)
      return res.status(StatusCodes.CONFLICT).json({
        message: req.t(
          "chats.controllers.add-user-to-group-chat.user-already-in-chat",
        ),
      });

    const user = await chatService.addUserToChat({ chatId, userId });
    return res.status(StatusCodes.CREATED).json({ user });
  } catch {
    next(new Error(req.t("chats.controllers.add-user-to-group-chat.failure")));
  }
};
