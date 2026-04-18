"use server";

import { AUTH_API } from "@/utils/api";
import { User } from "@packages/schemas";
import { AxiosError } from "axios";
import { extractRefreshTokenFromSetCookieString } from "../utils/extractRefreshTokenFromSetCookieString";
import { setAccessTokenCookie } from "../utils/setAccessTokenCookie";
import { setRefreshTokenCookie } from "../utils/setRefreshTokenCookie";

// @ts-expect-error User isn't returned when request fails
export async function signupUser(formData: FormData): Promise<User> {
  try {
    const {
      data: { user, accessToken },
      headers,
    } = await AUTH_API.post("/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
