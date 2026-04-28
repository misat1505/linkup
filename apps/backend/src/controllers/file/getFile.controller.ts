import { extractValidatedRequest } from "@/utils/extractValidatedRequest";
import { buildValidatedResponder } from "@/utils/validatedResponder";
import { API_CONTRACT, CONTRACT_KEYS } from "@packages/api-contract";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const contractKey = CONTRACT_KEYS.GET_FILE;

const sendFileBuilder =
  (filename: string, req: Request, res: Response) =>
  async (
    validator: () => Promise<boolean>,
    errorMessage = req.t("files.controllers.get-file.default-error-message"),
  ) => {
    const respond = buildValidatedResponder(res, contractKey);

    const fileStorage = req.app.services.fileStorage;
    const result = await validator();

    if (!result) {
      return respond(StatusCodes.FORBIDDEN, { message: errorMessage });
    }

    try {
      const url = await fileStorage.getSignedUrl(filename);
      return respond(StatusCodes.OK, { url });
    } catch {
      return respond(StatusCodes.NOT_FOUND, {
        message: req.t("files.controllers.get-file.not-found"),
      });
    }
  };

/**
 * Controller to retrieve a file based on specified filters and parameters.
 *
 * @remarks
 * This controller handles the logic of fetching a file from storage based on the filter type (`avatar`, `chat-message`, `chat-photo`, `cache`, or `post`) and additional parameters such as `chatId` or `postId`. It performs the necessary validation checks for the request parameters and provides a signed URL for the requested file if the conditions are met. It also includes detailed error handling for various cases like invalid filters or missing parameters.
 *
 * @param {Request} req - The Express request object containing the filename, filter, and any optional parameters (`chatId`, `postId`).
 * @param {Response} res - The Express response object used to send the signed URL or error messages back to the client.
 * @param {NextFunction} next - The Express next function used for error handling.
 *
 * @source
 */
export const getFileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const respond = buildValidatedResponder(res, contractKey);

  try {
    const {
      params: { filename },
      query,
    } = extractValidatedRequest(req, API_CONTRACT[contractKey]);

    const userId = req.user!.id;
    const { fileService, fileStorage } = req.app.services;

    const sendFile = (path: string) => sendFileBuilder(path, req, res);

    switch (query.filter) {
      case "avatar": {
        const path = `avatars/${filename}`;
        return sendFile(path)(
          () => fileService.isUserAvatar(filename),
          req.t("files.controllers.get-file.avatar-not-found"),
        );
      }

      case "chat-photo": {
        const path = `chats/${query.chat}/${filename}`;
        return sendFile(path)(
          () => fileService.isChatPhoto(filename, userId),
          req.t("files.controllers.get-file.group-photo-not-found"),
        );
      }

      case "chat-message": {
        const path = `chats/${query.chat}/${filename}`;
        return sendFile(path)(
          () => fileService.isChatMessage(filename, userId),
          req.t("files.controllers.get-file.group-photo-not-found"),
        );
      }

      case "cache": {
        const path = `cache/${userId}/${filename}`;

        try {
          const url = await fileStorage.getSignedUrl(path);

          return respond(StatusCodes.OK, { url });
        } catch {
          return respond(StatusCodes.NOT_FOUND, {
            message: req.t("files.controllers.get-file.not-found"),
          });
        }
      }

      case "post": {
        const path = `posts/${query.post}/${filename}`;

        try {
          const url = await fileStorage.getSignedUrl(path, 86400);

          return respond(StatusCodes.OK, { url });
        } catch {
          return respond(StatusCodes.NOT_FOUND, {
            message: req.t("files.controllers.get-file.not-found"),
          });
        }
      }
    }
  } catch {
    next(new Error(req.t("files.controllers.get-file.failure")));
  }
};
