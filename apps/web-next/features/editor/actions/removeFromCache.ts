"use server";

import { FILE_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

export async function removeFromCache(url: string): Promise<void> {
  const splitted = url.split("/");
  const lastPart = splitted[splitted.length - 1];
  const filename = lastPart.split("?")[0];

  const api = await serverSideRequestFactory({
    base: FILE_API,
    include: {
      accessToken: true,
    },
  });

  await api.delete(`/cache/${filename}`);
}
