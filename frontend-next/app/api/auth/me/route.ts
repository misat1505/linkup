import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_API } from "@/utils/api";

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh-token")?.value;

  const response = await AUTH_API.post(
    "/refresh",
    {},
    { headers: { cookie: `refresh-token=${refreshToken}` } },
  );

  const accessToken = response.data.accessToken;

  const { data } = await AUTH_API.get("/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return NextResponse.json(data.user);
}
