import { extractValidatedRequest } from "@/utils/extract-validated-request";
import { processAvatar } from "@/utils/process-avatar";
import { buildValidatedResponder } from "@/utils/validated-responder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

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
 */
export const createGroupChatController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const contractKey = CONTRACT_KEYS.CREATE_GROUP_CHAT;
	const respond = buildValidatedResponder(res, contractKey);

	try {
		const userId = req.user!.id;

		const {
			body: { users, name },
		} = extractValidatedRequest(req, API_CONTRACT[contractKey]);

		const { chatService, fileStorage } = req.app.services;

		if (!users.includes(userId)) {
			return respond(StatusCodes.BAD_REQUEST, {
				message: req.t("chats.controllers.create-group-chat.not-belonging-to-you"),
			});
		}

		const newFilename = req.file ? uuidv4() + ".webp" : null;

		const chat = await chatService.createGroupChat(users, name || null, newFilename);

		if (newFilename) {
			await processAvatar(fileStorage, req.file, `chats/${chat.id}/`, newFilename);
		}

		return respond(StatusCodes.CREATED, { chat });
	} catch {
		next(new Error(req.t("chats.controllers.create-group-chat.failure")));
	}
};
