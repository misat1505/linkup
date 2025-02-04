import { v4 as uuidv4 } from "uuid";

/**
 * Generates a new unique filename using uuid and keeps the original file extension.
 *
 * @param filename - The original filename.
 * @returns A new filename consisting of a UUID and the original file extension.
 *
 * @source
 */
export function generateNewFilename(filename: string): string {
  const splitted = filename.split(".");
  const extension = splitted.pop();
  const newname = uuidv4();

  return extension ? `${newname}.${extension}` : newname;
}
