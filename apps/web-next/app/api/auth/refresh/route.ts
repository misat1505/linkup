import { refreshToken } from "@/features/auth/utils/refresh-token";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		const accessToken = await refreshToken();

		return NextResponse.json({
			accessToken,
		});
	} catch {
		return NextResponse.json({ message: "Failed to refresh token" }, { status: 401 });
	}
}
