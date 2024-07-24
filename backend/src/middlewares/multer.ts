import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(__dirname, "..", "..", "static");
    fs.mkdirSync(destinationPath, { recursive: true });
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}.${ext}`);
  },
});

export const upload = multer({ storage });
