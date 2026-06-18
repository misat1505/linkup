import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "./utils/constants";

export async function proxy(request: NextRequest) {
	if (request.headers.get("Next-Action")) {
		return NextResponse.next();
	}

	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
		return NextResponse.next();
	}

	if (request.headers.get("accept")?.includes("text/html") === false) {
		return NextResponse.next();
	}

	const accessTokenCookie = request.cookies.get("access-token")?.value;
	if (accessTokenCookie) {
		return NextResponse.next();
	}

	const refreshTokenCookie = request.cookies.get("refresh-token")?.value;
	if (!refreshTokenCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		const response = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				Cookie: `refresh-token=${refreshTokenCookie}`,
			},
		});

		if (!response.ok) return NextResponse.redirect(new URL("/login", request.url));

		const data = await response.json();
		const accessToken = data.accessToken;

		const nextResponse = NextResponse.next();

		nextResponse.cookies.set({
			name: "access-token",
			value: accessToken,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 15,
		});

		return nextResponse;
	} catch {
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: ["/chats", "/chats/:path*", "/friends", "/posts", "/posts/:path*", "/settings"],
};
