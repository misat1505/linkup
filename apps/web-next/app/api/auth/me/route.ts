import { NextResponse } from "next/server";
import { AUTH_API } from "@/utils/api";
import { refreshToken } from "@/features/auth/utils/refresh-token";
import { serverSideRequestFactory } from "@/utils/server-side-request-factory";

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
