import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";
import {
  useGetReadableCommentUploadDate,
  timeDifference,
} from "@/utils/timeDifference";
import { createFullName } from "@/utils/createFullName";
import Avatar from "@/components/shared/Avatar";
import { Message } from "@/features/chats/schemas/message";
import { usePostCommentsSectionContext } from "../providers/PostCommentSectionProvider";
import Image from "@/components/shared/Image";
import ProtectedVideo from "@/components/shared/ProtectedVideo";
import { getFileType } from "@/utils/getFileType";
import { File } from "@/features/chats/schemas/file";
import ProtectedFile from "@/components/shared/ProtectedFile";

export default function Comment({ message }: { message: Message }) {
  const uploadDate = useGetReadableCommentUploadDate(
    timeDifference(message.createdAt),
  );

  return (
    <div className="flex gap-x-2 p-2">
      <Avatar
        src={buildFileURL(message.author.photoURL, { type: "avatar" })}
        alt={getInitials(message.author)}
        className="border"
      />
      <div className="max-w-[calc(100%-4rem)]">
        <h2 className="text-nowrap">
          <span className="font-semibold">
            {createFullName(message.author)}{" "}
          </span>
          <span className="italic">{uploadDate}</span>
        </h2>
        <MultimediaDisplay files={message.files} />
        <p>{message.content}</p>
      </div>
    </div>
  );
}

function MultimediaDisplay({ files }: { files: File[] }) {
  if (files.length === 0) return null;

  return (
    <div className="mt-2 flex">
      {files.map((file) => (
        <MultimediaDisplayItem file={file} key={file.id} />
      ))}
    </div>
  );
}

function MultimediaDisplayItem({ file }: { file: File }) {
  const type = getFileType(file.url);
  const { chat } = usePostCommentsSectionContext();

  if (!type) return null;

  if (type === "image")
    return (
      <Image
        src={buildFileURL(file.url, { type: "chat-message", id: chat.id })}
        className={{
          common: "h-40 w-40 object-cover",
          error: "bg-slate-200 font-semibold",
        }}
        alt="image"
        errorContent="Error loading image."
      />
    );

  if (type === "video")
    return (
      <ProtectedVideo
        src={buildFileURL(file.url, { type: "chat-message", id: chat.id })}
      />
    );

  return (
    <ProtectedFile
      src={buildFileURL(file.url, { type: "chat-message", id: chat.id })}
    />
  );
}
