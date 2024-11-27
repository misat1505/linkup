import path from "path";
import fs from "fs";
import { User } from "../types/User";
import { Post } from "../types/Post";

export function handleMarkdownUpdate(
  content: string,
  userId: User["id"],
  postId: Post["id"]
): string {
  const urls = extractUrlsFromMarkdown(content);
  const filesInfo = extractFileInfo(urls);
  migrateFiles(filesInfo, userId, postId);
  removeUnusedFiles(filesInfo, postId);
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

function migrateFiles(
  files: FileInfo[],
  userId: User["id"],
  postId: Post["id"]
) {
  const cachePath = path.join(__dirname, "..", "..", "files", "cache", userId);
  const postFilesPath = path.join(
    __dirname,
    "..",
    "..",
    "files",
    "posts",
    postId
  );

  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
  if (!fs.existsSync(postFilesPath))
    fs.mkdirSync(postFilesPath, { recursive: true });

  files.forEach((file) => {
    if (file.type === "post") return;

    const cacheFilePath = path.join(cachePath, file.filename);
    const postFilePath = path.join(postFilesPath, file.filename);

    fs.copyFileSync(cacheFilePath, postFilePath);
  });
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

function removeUnusedFiles(files: FileInfo[], postId: Post["id"]) {
  const postFilesPath = path.join(
    __dirname,
    "..",
    "..",
    "files",
    "posts",
    postId
  );

  const filesInDirectory = fs.readdirSync(postFilesPath);

  filesInDirectory.forEach((file) => {
    const isFileUsed = files.some((f) => f.filename === file);

    if (!isFileUsed) fs.unlinkSync(path.join(postFilesPath, file));
  });
}
