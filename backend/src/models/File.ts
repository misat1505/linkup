export type File = {
  id: string;
  url: string;
};

export function isFile(obj: any): obj is File {
  return typeof obj.id === "string" && typeof obj.url === "string";
}
