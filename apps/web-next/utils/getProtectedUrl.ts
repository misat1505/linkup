"use server";

import { getAccessTokenFromCookie } from "@/features/auth/utils/getAccessTokenFromCookie";

export async function getProtectedUrl(url: string): Promise<string> {
  const token = await getAccessTokenFromCookie();

  const result = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!result.ok) throw new Error();
  const data = await result.json();
  return data.url;
}
