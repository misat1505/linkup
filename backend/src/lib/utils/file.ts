export const createFilename = (
  file: Express.Multer.File | undefined
): string | null => {
  const filename = file ? file.destination.slice(1) + file.filename : null;
  return filename;
};
