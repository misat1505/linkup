"use server";

import { AUTH_API } from "@/utils/api";
import { User } from "@packages/schemas";
import { AxiosError } from "axios";
import { LoginFormType } from "../schemas/auth.validators";
import { extractRefreshTokenFromSetCookieString } from "../utils/extract-refresh-token-from-set-cookie-string";
import { setAccessTokenCookie } from "../utils/set-access-token-cookie";
import { setRefreshTokenCookie } from "../utils/set-refresh-token-cookie";

// @ts-expect-error User isn't returned when request fails
export async function loginUser(payload: LoginFormType): Promise<User> {
  try {
    const {
      data: { user, accessToken },
      headers,
    } = await AUTH_API.post("/login", payload);

    const cookieString = headers["set-cookie"]![0] as string;
    const refreshToken = extractRefreshTokenFromSetCookieString(cookieString);

    if (!refreshToken) throw new Error("Got response without refresh token");

    await Promise.all([
      setRefreshTokenCookie(refreshToken),
      setAccessTokenCookie(accessToken),
    ]);

    return User.parse(user);
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data.message);
    }
  }
}
