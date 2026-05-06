import { Chat, File } from "@packages/schemas";
import { buildFileURL } from "../../../utils/build-file-url";
import { getFileType } from "../../../utils/get-file-type";
import { Image } from "../../misc/image";
import { ProtectedFile } from "../../misc/protected-file";
import { ProtectedVideo } from "../../misc/protected-video";

export function MultimediaDisplay({
  files,
  chatId,
}: {
  files: File[];
  chatId: Chat["id"];
}) {
  if (files.length === 0) return null;

  return (
    <div className="mt-2 flex">
      {files.map((file) => (
        <MultimediaDisplayItem file={file} key={file.id} chatId={chatId} />
      ))}
    </div>
  );
}

function MultimediaDisplayItem({
  file,
  chatId,
}: {
  file: File;
  chatId: Chat["id"];
}) {
  const type = getFileType(file.url);

  if (!type) return null;

  if (type === "image")
    return (
      <Image
        alt={file.url}
        src={buildFileURL(file.url, { type: "chat-message", id: chatId })}
        className={{
          common: "h-40 w-40 object-cover",
          error: "bg-slate-200 font-semibold",
        }}
        errorContent="Error loading image."
        sizes="160px"
      />
    );

  if (type === "video")
    return (
      <ProtectedVideo
        src={buildFileURL(file.url, { type: "chat-message", id: chatId })}
      />
    );

  return (
    <ProtectedFile
      src={buildFileURL(file.url, { type: "chat-message", id: chatId })}
    />
  );
}
