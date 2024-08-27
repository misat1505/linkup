import { hasOnlyKeys } from "./utils";

export type File = {
  id: string;
  url: string;
};

export function isFile(obj: any): obj is File {
  const allowedKeys = ["id", "url"];

  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, allowedKeys) &&
    typeof obj.id === "string" &&
    typeof obj.url === "string"
  );
}
