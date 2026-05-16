import { cookies } from "next/headers";

export async function getLanguageCookie() {
	const cookieStore = await cookies();
	const language = cookieStore.get("lang")?.value;
	return language;
}
