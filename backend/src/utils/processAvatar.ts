import sharp from "sharp";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const processProfileImage = async (
  filePath: string,
  outputPath: string
): Promise<void> => {
  const imageBuffer = fs.readFileSync(filePath);
  fs.unlinkSync(filePath);

  await sharp(imageBuffer)
    .resize(100, 100)
    .webp({ quality: 80 })
    .toFile(outputPath);
};

export const processAvatar = async (
  filePath: string | undefined
): Promise<string | null> => {
  if (!filePath) return null;

  const outputPath = path.join(
    __dirname,
    "..",
    "..",
    "static",
    `${uuidv4()}.webp`
  );

  try {
    await processProfileImage(filePath, outputPath);
    return path.basename(outputPath);
  } catch {
    return null;
  }
};
