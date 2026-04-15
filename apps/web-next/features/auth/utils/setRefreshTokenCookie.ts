import { cookies } from "next/headers";

export async function setRefreshTokenCookie(value: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "refresh-token",
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });
}
