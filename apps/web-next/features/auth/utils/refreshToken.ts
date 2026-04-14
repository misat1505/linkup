import { AUTH_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { setAccessTokenCookie } from "./setAccessTokenCookie";

export async function refreshToken() {
  const api = await serverSideRequestFactory({
    base: AUTH_API,
    include: {
      refreshToken: true,
    },
  });

  const response = await api.post("/refresh");

  const accessToken = response.data.accessToken;

  await setAccessTokenCookie(accessToken);

  return accessToken;
}
