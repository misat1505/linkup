"use server";

import { AUTH_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { User } from "@packages/schemas";

export async function updateMe(formData: FormData): Promise<User> {
  const api = await serverSideRequestFactory({
    base: AUTH_API,
    include: {
      accessToken: true,
    },
  });

  const {
    data: { user },
  } = await api.put("/user", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return User.parse(user);
}
