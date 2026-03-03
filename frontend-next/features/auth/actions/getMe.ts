"use server";

import { AUTH_API } from "@/utils/api";
import { refreshToken } from "./refreshToken";
import { User } from "../schemas/user";
import { getAccessTokenFromCookie } from "../utils/getAccessTokenFromCookie";

export async function getMe(): Promise<User> {
  await refreshToken();

  const accessToken = await getAccessTokenFromCookie();

  const {
    data: { user },
  } = await AUTH_API.get("/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return User.parse(user);
}
