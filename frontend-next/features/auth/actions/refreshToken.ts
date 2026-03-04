"use server";

import { AUTH_API } from "@/utils/api";
import { setAccessTokenCookie } from "../utils/setAccessTokenCookie";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

export async function refreshToken() {
  const api = await serverSideRequestFactory({
    base: AUTH_API,
    include: {
      refreshToken: true,
    },
  });

  const response = await api.post("/refresh");

  await setAccessTokenCookie(response.data.accessToken);

  return response;
}
