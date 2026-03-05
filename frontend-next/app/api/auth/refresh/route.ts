import { NextResponse } from "next/server";
import { refreshToken } from "@/features/auth/utils/refreshToken";

export async function POST() {
  try {
    const accessToken = await refreshToken();

    return NextResponse.json({
      accessToken,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to refresh token" },
      { status: 401 },
    );
  }
}
