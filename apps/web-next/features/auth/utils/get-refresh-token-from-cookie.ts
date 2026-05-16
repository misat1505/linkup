import { cookies } from "next/headers";

export async function getRefreshTokenFromCookie() {
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get("refresh-token")?.value;
	return refreshToken;
}
