import { FILE_API } from "@/utils/api";

export function replaceLinks(markdown: string): string {
  const baseApiURL = FILE_API.defaults.baseURL!;
  const escapedBaseUrl = baseApiURL.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  const fileLinkRegex = new RegExp(
    `${escapedBaseUrl}/([a-zA-Z0-9._-]+)(\\?[^\\s)"]*)?`,
    "g",
  );

  return markdown.replace(fileLinkRegex, (_, filename, query) => {
    const queryString = query ?? "";
    return `/api/protected-file/${filename}${queryString}`;
  });
}
