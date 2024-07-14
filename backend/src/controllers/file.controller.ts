import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const getFile = async (req: Request, res: Response) => {
  const { filename } = req.params;

  const filepath = path.join(__dirname, "..", "..", "static", filename);

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ message: "File not found." });
  }

  res.status(200).sendFile(filepath);
};
