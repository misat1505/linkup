"use server";

import { AUTH_API } from "@/utils/api";
import { LoginFormType } from "../schemas/auth.validators";
import { User } from "../schemas/user";
import { setRefreshTokenCookie } from "../utils/setRefreshTokenCookie";
import { setAccessTokenCookie } from "../utils/setAccessTokenCookie";
import { extractRefreshTokenFromSetCookieString } from "../utils/extractRefreshTokenFromSetCookieString";

export async function loginUser(payload: LoginFormType): Promise<User> {
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
}
