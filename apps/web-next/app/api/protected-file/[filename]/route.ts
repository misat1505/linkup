import { getAccessTokenFromCookie } from "@/features/auth/utils/getAccessTokenFromCookie";
import { FILE_API } from "@/utils/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const token = await getAccessTokenFromCookie();

  const { filename } = await params;
  const url = new URL(req.url);
  const query = url.search;

  const result = await fetch(
    `${FILE_API.defaults.baseURL}/${filename}${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!result.ok) {
    return new Response("Failed to get signed url", { status: 500 });
  }

  const data = await result.json();

  return Response.redirect(data.url);
}
