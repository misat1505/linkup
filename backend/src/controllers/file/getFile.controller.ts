import { NextFunction, Request, Response } from "express";
import {
  Filename,
  FileQuery,
} from "../../validators/files/getFiles.validators";
import { StatusCodes } from "http-status-codes";

const sendFileBuilder =
  (filename: string, req: Request, res: Response) =>
  async (
    validator: () => Promise<boolean>,
    errorMessage = req.t("files.controllers.get-file.default-error-message")
  ) => {
    const fileStorage = req.app.services.fileStorage;
    const result = await validator();

    if (!result)
      return res.status(StatusCodes.FORBIDDEN).json({ message: errorMessage });

    try {
      const url = await fileStorage.getSignedUrl(filename);
      return res.status(StatusCodes.OK).json({ url });
    } catch (e) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: req.t("files.controllers.get-file.not-found") });
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
 *
 * @swagger
 * /files/{filename}:
 *   get:
 *     summary: Retrieve a file
 *     tags: [Files]
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         description: The name of the file to retrieve.
 *         schema:
 *           type: string
 *       - name: filter
 *         in: query
 *         required: true
 *         description: The type of file to filter (avatar, chat-message, chat-photo, cache or post).
 *         schema:
 *           type: string
 *           enum: [avatar, chat-message, chat-photo, cache, post]
 *       - name: chat
 *         in: query
 *         required: false
 *         description: Optional chat ID for chat-specific files. Required if filter is 'chat-message' or 'chat-photo'.
 *         schema:
 *           type: string
 *       - name: post
 *         in: query
 *         required: false
 *         description: Optional post ID for post-specific files. Required if filter is 'post'.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid request parameters
 *       403:
 *         description: Unauthorized access or query failed
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error when fetching the file
 */
export const getFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.validated!.params! as Filename;
    const query = req.validated!.query! as FileQuery;
    const userId = req.user!.id;
    const { fileService, fileStorage } = req.app.services;

    const sendFile = (path: string) => sendFileBuilder(path, req, res);

    switch (query.filter) {
      case "avatar": {
        const path = `avatars/${filename}`;
        return sendFile(path)(
          () => fileService.isUserAvatar(filename),
          req.t("files.controllers.get-file.avatar-not-found")
        );
      }

      case "chat-photo": {
        const path = `chats/${query.chat}/${filename}`;
        return sendFile(path)(
          () => fileService.isChatPhoto(filename, userId),
          req.t("files.controllers.get-file.group-photo-not-found")
        );
      }

      case "chat-message": {
        const path = `chats/${query.chat}/${filename}`;
        return sendFile(path)(
          () => fileService.isChatMessage(filename, userId),
          req.t("files.controllers.get-file.group-photo-not-found")
        );
      }

      case "cache": {
        const path = `cache/${userId}/${filename}`;
        try {
          const url = await fileStorage.getSignedUrl(path);
          return res.status(StatusCodes.OK).json({ url });
        } catch {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: req.t("files.controllers.get-file.not-found") });
        }
      }

      case "post": {
        const path = `posts/${query.post}/${filename}`;
        try {
          const url = await fileStorage.getSignedUrl(path);
          return res.status(StatusCodes.OK).json({ url });
        } catch {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: req.t("files.controllers.get-file.not-found") });
        }
      }
    }
  } catch (error) {
    next(new Error(req.t("files.controllers.get-file.failure")));
  }
};
