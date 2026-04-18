"use server";
import { USER_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { User } from "@packages/schemas";
import z from "zod";

export async function searchUsers(term: string): Promise<User[]> {
  const api = await serverSideRequestFactory({
    base: USER_API,
    include: {
      accessToken: true,
    },
  });

  const {
    data: { users },
  } = await api.get(`/search?term=${term}`);

  return z.array(User).parse(users);
}
