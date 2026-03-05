import { NextResponse } from "next/server";
import { AUTH_API } from "@/utils/api";
import { setAccessTokenCookie } from "@/features/auth/utils/setAccessTokenCookie";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

export async function POST() {
  try {
    const api = await serverSideRequestFactory({
      base: AUTH_API,
      include: {
        refreshToken: true,
      },
    });

    const response = await api.post("/refresh");

    const accessToken = response.data.accessToken;

    await setAccessTokenCookie(accessToken);

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
