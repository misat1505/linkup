import { NextFunction, Request, Response } from "express";
import { FileService } from "../../services/FileService";
import fileStorage from "../../lib/FileStorage";

type Filter = "avatar" | "chat-message" | "chat-photo" | "cache" | "post";

const filterArray = ["avatar", "chat-message", "chat-photo", "cache", "post"];

const sendFileBuilder =
  (filename: string, req: Request, res: Response) =>
  async (
    fn: () => Promise<boolean>,

    errorMessage = req.t("files.controllers.get-file.default-error-message")
  ) => {
    const result = await fn();

    if (!result) return res.status(401).json({ message: errorMessage });

    try {
      const url = await fileStorage.getSignedUrl(filename);
      return res.status(200).json({ url });
    } catch (e) {
      return res
        .status(404)
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
 *       401:
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
    const { filename } = req.params;
    const filter = req.query.filter as Filter;
    const chatId = req.query.chat;
    const postId = req.query.post;
    const { userId } = req.body.token;

    if (!filterArray.includes(filter))
      return res.status(400).json({
        message:
          req.t("files.controllers.get-file.wrong-filter") +
          filterArray.join(", "),
      });

    if (
      ["chat-message", "chat-photo"].includes(filter) &&
      typeof chatId !== "string"
    )
      return res
        .status(400)
        .json({ message: req.t("files.controllers.get-file.bad-chat") });

    if (filter === "post" && typeof postId !== "string")
      return res
        .status(400)
        .json({ message: req.t("files.controllers.get-file.bad-post") });

    const prefix = chatId ? `chats/${chatId}` : "avatars";
    const sendFile = sendFileBuilder(`${prefix}/${filename}`, req, res);

    if (filter === "avatar") {
      const response = await sendFile(
        () => FileService.isUserAvatar(filename),
        req.t("files.controllers.get-file.avatar-not-found")
      );
      return response;
    } else if (filter === "chat-photo") {
      const response = await sendFile(
        () => FileService.isChatPhoto(filename, userId),
        req.t("files.controllers.get-file.group-photo-not-found")
      );
      return response;
    } else if (filter === "chat-message") {
      const response = await sendFile(
        () => FileService.isChatMessage(filename, userId),
        req.t("files.controllers.get-file.group-photo-not-found")
      );
      return response;
    } else if (filter === "cache") {
      try {
        const url = await fileStorage.getSignedUrl(
          `cache/${userId}/${filename}`
        );
        return res.status(200).json({ url });
      } catch (e) {
        return res
          .status(404)
          .json({ message: req.t("files.controllers.get-file.not-found") });
      }
    } else if (filter === "post") {
      try {
        const url = await fileStorage.getSignedUrl(
          `posts/${postId}/${filename}`
        );
        return res.status(200).json({ url });
      } catch (e) {
        return res
          .status(404)
          .json({ message: req.t("files.controllers.get-file.not-found") });
      }
    }
  } catch (e) {
    next(new Error(req.t("files.controllers.get-file.failure")));
  }
};
