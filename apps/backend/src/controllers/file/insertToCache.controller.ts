import { generateNewFilename } from "@/utils/generateNewFilename";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const CACHE_CAPACITY = 10;

/**
 * Controller to upload a file to the user's cache.
 *
 * @remarks
 * This controller handles the logic of uploading a file to the user's cache storage. It validates the presence of a file in the request, checks if the user has reached the cache capacity limit, and if not, uploads the file with a newly generated filename. The function responds with a success message containing the new filename or an error message if the cache limit is reached or the file upload fails.
 *
 * @param {Request} req - The Express request object containing the file to upload and the user token.
 * @param {Response} res - The Express response object used to send the success message or error response.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const insertToCache = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contractKey = CONTRACT_KEYS.INSERT_TO_CACHE;
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const file = req.file;
    const userId = req.user!.id;
    const fileStorage = req.app.services.fileStorage;

    if (!file) {
      return respond(StatusCodes.BAD_REQUEST, {
        message: req.t("files.controllers.insert-to-cache.no-file"),
      });
    }

    const cachePaths = await fileStorage.listFiles(`cache/${userId}`);

    if (cachePaths.length >= CACHE_CAPACITY) {
      return respond(StatusCodes.BAD_REQUEST, {
        message: req.t("files.controllers.insert-to-cache.limit-reached", {
          count: CACHE_CAPACITY,
        }),
      });
    }

    const filename = generateNewFilename(file.originalname);

    await fileStorage.uploadFile(
      file.buffer,
      file.mimetype,
      `cache/${userId}/${filename}`,
    );

    return respond(StatusCodes.CREATED, {
      file: filename,
    });
  } catch {
    next(new Error(req.t("files.controllers.insert-to-cache.failure")));
  }
};
