import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_API } from "@/utils/api";
import { refreshToken } from "@/features/auth/utils/refreshToken";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

export async function GET() {
  await refreshToken();

  const api = await serverSideRequestFactory({
    base: AUTH_API,
    include: {
      accessToken: true,
    },
  });

  const {
    data: { user },
  } = await api.get("/user");

  return NextResponse.json(user);
}
