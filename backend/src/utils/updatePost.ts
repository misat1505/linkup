import { User } from "../types/User";
import { Post } from "../types/Post";
import { FileStorage } from "../lib/FileStorage";

/**
 * Handles updating a post's content with new file references.
 * This function extracts URLs from the markdown content, migrates files from the cache to the post directory,
 * removes unused files, and updates the URLs to reflect their new locations.
 *
 * @param content - The markdown content to be updated.
 * @param userId - The ID of the user making the update.
 * @param postId - The ID of the post being updated.
 * @returns The updated content with modified URLs.
 *
 * @source
 */
export async function handleMarkdownUpdate(
  fileStorage: FileStorage,
  content: string,
  userId: User["id"],
  postId: Post["id"]
): Promise<string> {
  const urls = extractUrlsFromMarkdown(content);
  const filesInfo = extractFileInfo(urls);
  await migrateFiles(fileStorage, filesInfo, userId, postId);
  await removeUnusedFiles(fileStorage, filesInfo, postId);
  return updateUrlsInContent(content, filesInfo, postId);
}

function extractUrlsFromMarkdown(content: string): string[] {
  const urlRegex =
    /!\[.*?\]\(\s*(.*?)\s*\)|<img[^>]+src="([^"]+)"|<source[^>]+src="([^"]+)"/g;
  const urls: string[] = [];
  let match;

  while ((match = urlRegex.exec(content)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    } else if (match[2]) {
      urls.push(match[2]);
    } else if (match[3]) {
      urls.push(match[3]);
    }
  }

  return urls;
}

type FileInfo = { filename: string; type: "post" | "cache" };

function extractFileInfo(urls: string[]): FileInfo[] {
  return urls.map((url) => {
    const splitted = url.split("/");
    const lastPart = splitted[splitted.length - 1];
    const filename = lastPart.split("?")[0];

    const type: "post" | "cache" = url.includes("cache") ? "cache" : "post";

    return { filename, type };
  });
}

async function migrateFiles(
  fileStorage: FileStorage,
  files: FileInfo[],
  userId: User["id"],
  postId: Post["id"]
) {
  await Promise.all(
    files.map(async (file) => {
      if (file.type === "post") return;

      await fileStorage.copyFile(
        `cache/${userId}/${file.filename}`,
        `posts/${postId}/${file.filename}`
      );
    })
  );
}

function updateUrlsInContent(
  content: string,
  filesInfo: FileInfo[],
  postId: Post["id"]
): string {
  return filesInfo.reduce((updatedContent, file) => {
    if (file.type === "cache") {
      const regex = new RegExp(`(filter=cache)`, "g");
      const newUrl = `filter=post&post=${postId}`;
      return updatedContent.replace(regex, newUrl);
    }
    return updatedContent;
  }, content);
}

async function removeUnusedFiles(
  fileStorage: FileStorage,
  files: FileInfo[],
  postId: Post["id"]
) {
  const paths = await fileStorage.listFiles(`posts/${postId}`);

  paths.forEach((path) => {
    const splitted = path.split("/");
    const filename = splitted[splitted.length - 1];

    const isFileUsed = files.some((f) => f.filename === filename);
    if (!isFileUsed) fileStorage.deleteFile(`posts/${postId}/${filename}`);
  });
}
