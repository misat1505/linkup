import { apiContractClient } from "@/lib/apiContractClient";
import { getAccessToken } from "@/lib/token";
import { buildFileURL } from "@/utils/buildFileURL";

export class FileService {
  static async downloadFile(
    url: string | null,
    filename: string | null,
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
    const res = await apiContractClient.getCache();
    return res.files.map((file) => buildFileURL(file, { type: "cache" }));
  }

  static async removeFromCache(url: string): Promise<void> {
    const splitted = url.split("/");
    const lastPart = splitted[splitted.length - 1];
    const filename = lastPart.split("?")[0];

    await apiContractClient.deleteFromCache({ params: { filename } });
  }

  static async insertFileToCache(file: File): Promise<string> {
    const res = await apiContractClient.insertToCache({ body: { file } });
    return buildFileURL(res.file, { type: "cache" });
  }
}
