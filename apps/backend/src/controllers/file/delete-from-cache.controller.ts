import { extractValidatedRequest } from "@/utils/extract-validated-request";
import { buildValidatedResponder } from "@/utils/validated-responder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Controller to delete a file from the user's cache.
 *
 * @remarks
 * This controller allows the user to delete a specific file from their cache by providing the file's name. It checks the file storage and performs the deletion. If successful, it returns a success message. If the file is not found or there is an error during the process, it handles the respective cases with appropriate responses.
 *
 * @param {Request} req - The Express request object containing the file name to be deleted and the user's identifier.
 * @param {Response} res - The Express response object used to return the result of the deletion operation.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const deleteFromCache = async (req: Request, res: Response, next: NextFunction) => {
	const contractKey = CONTRACT_KEYS.DELETE_FROM_CACHE;
	const respond = buildValidatedResponder(res, contractKey);

	try {
		const {
			params: { filename },
		} = extractValidatedRequest(req, API_CONTRACT[contractKey]);

		const userId = req.user!.id;
		const fileStorage = req.app.services.fileStorage;

		await fileStorage.deleteFile(`cache/${userId}/${filename}`);

		return respond(StatusCodes.OK, {
			message: req.t("files.controllers.delete-from-cache.success"),
		});
	} catch {
		next(new Error(req.t("files.controllers.delete-from-cache.failure")));
	}
};
