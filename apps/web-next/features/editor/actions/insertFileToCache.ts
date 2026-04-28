"use server";

import { FILE_API } from "@/utils/api";
import { buildFileURL } from "@/utils/buildFileURL";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

export async function insertFileToCache(formData: FormData): Promise<string> {
  const api = await serverSideRequestFactory({
    base: FILE_API,
    include: {
      accessToken: true,
    },
  });

  const result = await api.post("/cache", formData);
  return buildFileURL(result.data.file, { type: "cache" });
}
