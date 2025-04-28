import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { FileStorage } from "../lib/FileStorage";

/**
 * Processes an avatar image: resizes, converts to WebP, and uploads it.
 *
 * @param file - The uploaded file object (usually from Multer).
 * @param path - The directory path where the avatar will be stored (default: "avatars/").
 * @param name - An optional name for the file. If not provided, a UUID will be generated.
 * @returns The new filename if successful, or null if an error occurs.
 *
 * @source
 */
export const processAvatar = async (
  fileStorage: FileStorage,
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
