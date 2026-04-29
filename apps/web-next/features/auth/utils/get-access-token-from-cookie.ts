import { cookies } from "next/headers";

export async function getAccessTokenFromCookie() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;
  return accessToken;
}
