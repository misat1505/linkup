"use server";

import { cache } from "react";
import { User } from "../schemas/user";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { AUTH_API } from "@/utils/api";

export const getMeCached = cache(async () => {
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
});
