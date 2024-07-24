import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const getFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    const filepath = path.join(__dirname, "..", "..", "static", filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "File not found." });
    }

    return res.status(200).sendFile(filepath);
  } catch (e) {
    return res.status(500).json({ message: "Cannot fetch file." });
  }
};
