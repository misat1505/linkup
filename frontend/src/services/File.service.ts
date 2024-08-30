import { FILE_API } from "./utils";

export class FileService {
  static async downloadFile(
    url: string | null,
    filename: string | null
  ): Promise<Blob | null> {
    if (url === null || filename === null) return null;

    const result = await fetch(url, {
      method: "GET",
      headers: {},
      credentials: "include"
    });
    const blob = await result.blob();

    return blob;
  }
}
