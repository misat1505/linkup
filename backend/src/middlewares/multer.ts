import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: any) => {
    const destinationPath = "./static/";
    fs.mkdirSync(destinationPath, { recursive: true });
    cb(null, destinationPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + `.${ext}`);
  },
});

export const upload = multer({ storage });
