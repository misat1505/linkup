import { AUTH_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/server-side-request-factory";
import { setAccessTokenCookie } from "./set-access-token-cookie";

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
