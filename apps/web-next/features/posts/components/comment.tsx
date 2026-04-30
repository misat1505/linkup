import Avatar from "@/components/shared/avatar";
import Image from "@/components/shared/image";
import ProtectedFile from "@/components/shared/protected-file";
import ProtectedVideo from "@/components/shared/protected-video";
import { buildFileURL } from "@/utils/build-file-url";
import { createFullName } from "@/utils/create-full-name";
import { getFileType } from "@/utils/get-file-type";
import { getInitials } from "@/utils/get-initials";
import {
  timeDifference,
  useGetReadableCommentUploadDate,
} from "@/utils/time-difference";
import { File, Message } from "@packages/schemas";
import { usePostCommentsSectionContext } from "../providers/post-comment-section-provider";

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
        sizes="160px"
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
