"use server";

import { AUTH_API } from "@/utils/api";
import { refreshToken } from "./refreshToken";
import { User } from "../schemas/user";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

export async function getMe(): Promise<User> {
  await refreshToken();

  const api = await serverSideRequestFactory({
    base: AUTH_API,
    include: {
      accessToken: true,
    },
  });

  const {
    data: { user },
  } = await api.get("/user");

  return User.parse(user);
}
