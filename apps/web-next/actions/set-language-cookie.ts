"use server";

import { cookies } from "next/headers";

export async function setLanguageCookie(lng: string) {
	const cookieStore = await cookies();
	cookieStore.set({
		name: "lang",
		value: lng,
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
	});
}
