import { getAccessToken } from "@/lib/token";
import { FILE_API } from "./utils";
import { API_URL } from "@/constants";

export class FileService {
  static async downloadFile(
    url: string | null,
    filename: string | null
  ): Promise<File | null> {
    if (url === null || filename === null) return null;

    const result = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      credentials: "include",
    });

    const data = await result.json();

    const res2 = await fetch(data.url);

    const blob = await res2.blob();

    const file = new File([blob], filename!, { type: blob.type });

    return file;
  }

  static async getCache(): Promise<string[]> {
    const result = await FILE_API.get("/cache");
    const files = result.data.files as string[];
    const fileURLs = files.map(
      (file) => `${API_URL}/files/${file}?filter=cache`
    );
    return fileURLs;
  }

  static async removeFromCache(url: string): Promise<void> {
    const splitted = url.split("/");
    const lastPart = splitted[splitted.length - 1];
    const filename = lastPart.split("?")[0];

    await FILE_API.delete(`/cache/${filename}`);
  }

  static async insertFileToCache(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const result = await FILE_API.post("/cache", formData);
    return `${API_URL}/files/${result.data.file}?filter=cache`;
  }
}
