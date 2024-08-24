import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { FileService } from "../services/FileService";

type Filter = "avatar" | "chat-message" | "chat-photo";

const filterArray = ["avatar", "chat-message", "chat-photo"];

const sendFileBuilder =
  (filename: string, res: Response) =>
  async (
    fn: () => Promise<boolean>,

    errorMessage = "Query failed"
  ) => {
    const result = await fn();

    if (!result) return res.status(404).json({ message: errorMessage });

    const filepath = path.join(__dirname, "..", "..", "static", filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "File not found." });
    }

    return res.status(200).sendFile(filepath);
  };

export const getFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filter = req.query.filter as Filter;
    const { userId } = req.body.token;

    if (!filterArray.includes(filter))
      return res.status(400).json({
        message: "Have to apply one of the filters: " + filterArray.join(", "),
      });

    const sendFile = sendFileBuilder(filename, res);

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
    }
  } catch (e) {
    return res.status(500).json({ message: "Cannot fetch file." });
  }
};
