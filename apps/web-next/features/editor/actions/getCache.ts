"use server";

import { FILE_API } from "@/utils/api";
import { API_URL } from "@/utils/constants";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import z from "zod";

export async function getCache(): Promise<string[]> {
  const api = await serverSideRequestFactory({
    base: FILE_API,
    include: {
      accessToken: true,
    },
  });

  const result = await api.get("/cache");
  const files = z.array(z.string()).parse(result.data.files);

  const fileURLs = files.map((file) => `${API_URL}/files/${file}?filter=cache`);

  return fileURLs;
}
