export const createFilename = (
  file: Express.Multer.File | undefined
): string | null => {
  const filename = file ? file.filename : null;
  return filename;
};
