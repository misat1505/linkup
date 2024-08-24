type Filter = "avatar" | "chat-photo" | "chat-message";

export function buildFileURL(baseUrl: string | null, filter: Filter) {
  if (!baseUrl) return "";

  const url = new URL(baseUrl);
  const searchParams = new URLSearchParams({ filter });

  url.search = searchParams.toString();

  return url.toString();
}
