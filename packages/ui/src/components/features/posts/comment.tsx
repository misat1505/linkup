import { Chat, File, Message } from "@packages/schemas";
import { useUiPackageContext } from "../../../config";
import { buildFileURL } from "../../../utils/build-file-url";
import { createFullName } from "../../../utils/create-full-name";
import { getFileType } from "../../../utils/get-file-type";
import {
  timeDifference,
  useGetReadableCommentUploadDate,
} from "../../../utils/time-difference";
import { Image } from "../../misc/image";
import { ProtectedFile } from "../../misc/protected-file";
import { ProtectedVideo } from "../../misc/protected-video";
import PostAuthorAvatar from "./post-author-avatar";

export function Comment({ message }: { message: Message }) {
  const { t } = useUiPackageContext();
  const uploadDate = useGetReadableCommentUploadDate(
    timeDifference(message.createdAt),
    t,
  );

  return (
    <div className="flex gap-x-2 p-2">
      <PostAuthorAvatar author={message.author} />
      <div className="max-w-[calc(100%-4rem)]">
        <h2 className="text-nowrap">
          <span className="font-semibold">
            {createFullName(message.author)}{" "}
          </span>
          <span className="italic">{uploadDate}</span>
        </h2>
        <MultimediaDisplay files={message.files} chatId={message.chatId} />
        <p>{message.content}</p>
      </div>
    </div>
  );
}

function MultimediaDisplay({
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
        <MultimediaDisplayItem file={file} chatId={chatId} key={file.id} />
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
        src={buildFileURL(file.url, { type: "chat-message", id: chatId })}
        className={{
          common: "h-40 w-40 object-cover",
          error: "bg-slate-200 font-semibold",
        }}
        sizes="160px"
        errorContent="Error loading image."
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
