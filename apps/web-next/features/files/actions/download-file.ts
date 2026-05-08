"use server";

import { cookies } from "next/headers";

export async function downloadFile(
  url: string,
): Promise<{ buffer: ArrayBuffer; type: string } | null> {
  const token = (await cookies()).get("access-token")?.value;

  const result = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await result.json();

  const res2 = await fetch(data.url);

  const blob = await res2.blob();
  const buffer = await blob.arrayBuffer();

  return {
    buffer,
    type: blob.type,
  };
}
