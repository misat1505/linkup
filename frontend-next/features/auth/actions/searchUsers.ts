"use server";
import { USER_API } from "@/utils/api";
import { User } from "../schemas/user";
import { getAccessTokenFromCookie } from "../utils/getAccessTokenFromCookie";
import z from "zod";

export async function searchUsers(term: string): Promise<User[]> {
  const accessToken = await getAccessTokenFromCookie();

  const {
    data: { users },
  } = await USER_API.get(`/search?term=${term}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return z.array(User).parse(users);
}
