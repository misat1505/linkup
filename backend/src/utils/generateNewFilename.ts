import { v4 as uuidv4 } from "uuid";

export function generateNewFilename(filename: string): string {
  const splitted = filename.split(".");
  const extension = splitted.pop();
  const newname = uuidv4();

  return extension ? `${newname}.${extension}` : newname;
}
