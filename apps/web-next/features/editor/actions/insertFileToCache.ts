"use server";

import { FILE_API } from "@/utils/api";
import { API_URL } from "@/utils/constants";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

export async function insertFileToCache(formData: FormData): Promise<string> {
  const api = await serverSideRequestFactory({
    base: FILE_API,
    include: {
      accessToken: true,
    },
  });

  const result = await api.post("/cache", formData);
  return `${API_URL}/files/${result.data.file}?filter=cache`;
}
