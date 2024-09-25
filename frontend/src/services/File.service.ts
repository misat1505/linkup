import { getAccessToken } from "../lib/token";

export class FileService {
  static async downloadFile(
    url: string | null,
    filename: string | null
  ): Promise<File | null> {
    if (url === null || filename === null) return null;

    const result = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
      credentials: "include"
    });
    const blob = await result.blob();

    const file = new File([blob], filename!, { type: blob.type });

    return file;
  }
}
