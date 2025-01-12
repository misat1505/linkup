import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { FileService } from "../../services/FileService";
import fileStorage from "../../lib/FileStorage";

type Filter = "avatar" | "chat-message" | "chat-photo" | "cache" | "post";

const filterArray = ["avatar", "chat-message", "chat-photo", "cache", "post"];

const sendFileBuilder =
  (filename: string, res: Response) =>
  async (
    fn: () => Promise<boolean>,

    errorMessage = "Query failed"
  ) => {
    const result = await fn();

    if (!result) return res.status(401).json({ message: errorMessage });

    try {
      const url = await fileStorage.getSignedUrl(filename);
      return res.status(200).json({ url });
    } catch (e) {
      return res.status(404).json({ message: "File not found." });
    }
  };

export const getFileController = async (req: Request, res: Response) => {
  /**
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
  try {
    const { filename } = req.params;
    const filter = req.query.filter as Filter;
    const chatId = req.query.chat;
    const postId = req.query.post;
    const { userId } = req.body.token;

    if (!filterArray.includes(filter))
      return res.status(400).json({
        message: "Have to apply one of the filters: " + filterArray.join(", "),
      });

    if (
      ["chat-message", "chat-photo"].includes(filter) &&
      typeof chatId !== "string"
    )
      return res.status(400).json({ message: "Chat has to be a string." });

    if (filter === "post" && typeof postId !== "string")
      return res.status(400).json({ message: "Post has to be a string." });

    const prefix = chatId ? `chats/${chatId}` : "avatars";
    const sendFile = sendFileBuilder(`${prefix}/${filename}`, res);

    if (filter === "avatar") {
      const response = await sendFile(
        () => FileService.isUserAvatar(filename),
        "Cannot find avatar of this name."
      );
      return response;
    } else if (filter === "chat-photo") {
      const response = await sendFile(
        () => FileService.isChatPhoto(filename, userId),
        "Cannot find chat photo of this name."
      );
      return response;
    } else if (filter === "chat-message") {
      const response = await sendFile(
        () => FileService.isChatMessage(filename, userId),
        "Cannot find chat photo of this name."
      );
      return response;
    } else if (filter === "cache") {
      try {
        const url = await fileStorage.getSignedUrl(
          `cache/${userId}/${filename}`
        );
        return res.status(200).json({ url });
      } catch (e) {
        return res.status(404).json({ message: "File not found." });
      }
    } else if (filter === "post") {
      try {
        const url = await fileStorage.getSignedUrl(
          `posts/${postId}/${filename}`
        );
        return res.status(200).json({ url });
      } catch (e) {
        return res.status(404).json({ message: "File not found." });
      }
    }
  } catch (e) {
    return res.status(500).json({ message: "Cannot fetch file." });
  }
};
