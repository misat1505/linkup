"use server";

import { AUTH_API } from "@/utils/api";
import { setAccessTokenCookie } from "../utils/setAccessTokenCookie";
import { getRefreshTokenFromCookie } from "../utils/getRefreshTokenFromCookie";

export async function refreshToken() {
  const refreshToken = await getRefreshTokenFromCookie();
  const response = await AUTH_API.post(
    "/refresh",
    {},
    {
      headers: {
        cookie: `refresh-token=${refreshToken}`,
      },
    },
  );

  await setAccessTokenCookie(response.data.accessToken);

  return response;
}
