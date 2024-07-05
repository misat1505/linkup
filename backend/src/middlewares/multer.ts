import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

const storage = multer.diskStorage({
  destination: function (req: Request, file: MulterFile, cb: any) {
    const destinationPath = "./static/";
    fs.mkdirSync(destinationPath, { recursive: true });
    cb(null, destinationPath);
  },
  filename: function (req: Request, file: MulterFile, cb: any) {
    const ext = file.originalname.split(".")[1];
    cb(null, uuidv4() + `.${ext}`);
  },
});

export const upload = multer({ storage });
