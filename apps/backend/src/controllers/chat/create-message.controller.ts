import { extractValidatedRequest } from "@/utils/extract-validated-request";
import { generateNewFilename } from "@/utils/generate-new-filename";
import { buildValidatedResponder } from "@/utils/validated-responder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to create a new message in a chat.
 *
 * @remarks
 * This controller handles the creation of a new message in a specified chat. It checks if the user is authorized
 * to send the message and if the response message exists when provided. It also handles the uploading of files
 * associated with the message and stores them in the appropriate directory.
 *
 * @param {Request} req - The Express request object containing the chat ID, message content, and optionally, the response ID and files.
 * @param {Response} res - The Express response object used to return the created message details.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const createMessageController = async (req: Request, res: Response, next: NextFunction) => {
	const contractKey = CONTRACT_KEYS.CREATE_MESSAGE;
	const respond = buildValidatedResponder(res, contractKey);

	try {
		const {
			body: { content, responseId },
			params: { chatId },
		} = extractValidatedRequest(req, API_CONTRACT[contractKey]);

		const userId = req.user!.id;
		const files = req.files as Express.Multer.File[];

		const { chatService, fileStorage } = req.app.services;

		const checks = [chatService.isUserInChat({ chatId, userId })];

		if (responseId) {
			checks.push(
				chatService.isMessageInChat({
					chatId,
					messageId: responseId,
				}),
			);
		}

		const [isUserAuthorized, isResponseInChat] = await Promise.all(checks);

		if (!isUserAuthorized) {
			return respond(StatusCodes.FORBIDDEN, {
				message: req.t("chats.controllers.create-message.user-not-belonging-to-chat"),
			});
		}

		if (responseId && !isResponseInChat) {
			return respond(StatusCodes.BAD_REQUEST, {
				message: req.t("chats.controllers.create-message.response-not-existent"),
			});
		}

		const filenames = await Promise.all(
			files.map(async (file) => {
				const name = generateNewFilename(file.originalname);
				const key = `chats/${chatId}/${name}`;
				await fileStorage.uploadFile(file.buffer, file.mimetype, key);
				return name;
			}),
		);

		const message = await chatService.createMessage({
			content,
			authorId: userId,
			chatId,
			files: filenames,
			responseId: responseId ?? null,
		});

		return respond(StatusCodes.CREATED, {
			message,
		});
	} catch {
		next(new Error(req.t("chats.controllers.create-message.failure")));
	}
};
