"use server";

import { AUTH_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { User } from "@packages/schemas";
import { cache } from "react";

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
