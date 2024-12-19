type FileType = "image" | "video" | "other";

export function getFileType(fileName: string): FileType | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) return null;

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv"];

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "other";
  }
}
