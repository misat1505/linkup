"use server";

import { cookies } from "next/headers";

export async function logoutUser() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "refresh-token",
    value: "",
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
  });

  cookieStore.set({
    name: "access-token",
    value: "",
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
  });
}
