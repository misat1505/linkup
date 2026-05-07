"use server";

import { FILE_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/server-side-request-factory";
import { buildFileURL } from "@packages/ui/utils/build-file-url";

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
