"use server";
import { USER_API } from "@/utils/api";
import { User } from "../schemas/user";
import z from "zod";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

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
