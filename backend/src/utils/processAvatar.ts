import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import fileStorage from "../lib/FileStorage";

export const processAvatar = async (
  file: Express.Multer.File | undefined,
  path: string = "avatars/",
  name?: string
): Promise<string | null> => {
  if (!file) return null;

  const filename = name || `${uuidv4()}.webp`;

  const key = `${path}${filename}`;

  const processedBuffer = await sharp(file.buffer)
    .resize(100, 100)
    .webp({ quality: 80 })
    .toBuffer();

  try {
    fileStorage.uploadFile(processedBuffer, file.mimetype, key);
    return filename;
  } catch {
    return null;
  }
};
