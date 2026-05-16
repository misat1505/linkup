import { extractValidatedRequest } from "@/utils/extract-validated-request";
import { buildValidatedResponder } from "@/utils/validated-responder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { Message } from "@packages/schemas";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to retrieve messages from a chat.
 *
 * @remarks
 * This controller handles the process of fetching messages from a specified chat. It checks if the user is authorized to read messages from the chat, processes the optional response ID, and retrieves the messages from the chat.
 *
 * @param {Request} req - The Express request object containing the chat ID, user's token, and optional response ID query parameter.
 * @param {Response} res - The Express response object used to return the retrieved messages.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const getChatMessagesController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const contractKey = CONTRACT_KEYS.GET_CHAT_MESSAGES;
	const respond = buildValidatedResponder(res, contractKey);

	try {
		const {
			params: { chatId },
			query,
		} = extractValidatedRequest(req, API_CONTRACT[contractKey]);

		const userId = req.user!.id;
		const chatService = req.app.services.chatService;

		const isUserAuthorized = await chatService.isUserInChat({
			chatId,
			userId,
		});

		if (!isUserAuthorized) {
			return respond(StatusCodes.FORBIDDEN, {
				message: req.t("chats.controllers.get-messages.unauthorized"),
			});
		}

		let messages: Message[];

		if ("responseId" in query) {
			const responseId = query.responseId! === "null" ? null : query.responseId!;
			messages = await chatService.getPostChatMessages(chatId, responseId);
		} else {
			messages = await chatService.getChatMessages(
				chatId,
				query.lastMessageId ?? undefined,
				query.limit,
			);
		}

		return respond(StatusCodes.OK, { messages });
	} catch {
		next(new Error(req.t("chats.controllers.get-messages.failure")));
	}
};
