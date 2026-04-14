import { getAccessTokenFromCookie } from "@/features/auth/utils/getAccessTokenFromCookie";
import { FILE_API } from "@/utils/api";
import { POST_FILE_VALID_DURATION } from "@/utils/constants";

const signedUrlCache = new Map<string, string>();

async function getSignedUrlCachedUnsafe(filename: string, query: string = "") {
  const key = filename + query;

  if (signedUrlCache.has(key)) {
    console.log("Cache hit", key);
    return signedUrlCache.get(key)!;
  }

  const url = `${FILE_API.defaults.baseURL}/${filename}${query}`;
  console.log("Sending request for signed URL:", url);

  const token = await getAccessTokenFromCookie();
  const result = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: POST_FILE_VALID_DURATION },
  });

  if (!result.ok) {
    console.error(
      "Failed to fetch signed URL:",
      result.status,
      result.statusText,
    );
    return "";
  }

  const data = await result.json();
  console.log("Received signed URL:", data.url);

  signedUrlCache.set(key, data.url);

  setTimeout(() => signedUrlCache.delete(key), POST_FILE_VALID_DURATION * 1000);

  return data.url;
}

function decodeHtmlEntities(str: string) {
  return str.replace(/&#x26;/g, "&").replace(/&amp;/g, "&");
}

export async function replaceLinksCachedUnsafe(
  markdown: string,
): Promise<string> {
  const baseApiURL = FILE_API.defaults.baseURL!;
  const escapedBaseUrl = baseApiURL.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  const fileLinkRegex = new RegExp(
    `${escapedBaseUrl}/([a-zA-Z0-9._-]+)(\\?[^\\s)"]*)?`,
    "g",
  );

  const matches = Array.from(markdown.matchAll(fileLinkRegex));

  const replacements = await Promise.all(
    matches.map(async (match) => {
      const [fullMatch, filename, query] = match;

      const index = match.index!;
      const before = markdown.slice(Math.max(0, index - 20), index);

      const isInsideSource = before.includes("<source");

      const decodedQuery = decodeHtmlEntities(query ?? "");
      const signedUrl = await getSignedUrlCachedUnsafe(filename, decodedQuery);

      if (isInsideSource) {
        return { fullMatch, url: signedUrl };
      }

      const width = 1200;
      const quality = 75;
      const url = `/_next/image?url=${encodeURI(signedUrl)}&w=${width}&q=${quality}`;

      return { fullMatch, url };
    }),
  );

  let result = markdown;
  for (const { fullMatch, url } of replacements) {
    result = result.replace(fullMatch, url);
  }

  return result;
}
