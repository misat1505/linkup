import { Request, Response } from "express";
import path from "path";

export const getFile = async (req: Request, res: Response) => {
  const { filename } = req.params;

  const filepath = path.join(__dirname, "..", "..", "static", filename);

  res.sendFile(filepath);
};
