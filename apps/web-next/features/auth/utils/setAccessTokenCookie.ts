import { cookies } from "next/headers";

export async function setAccessTokenCookie(value: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "access-token",
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });
}
