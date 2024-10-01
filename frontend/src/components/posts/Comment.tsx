import { Message } from "../../types/Message";
import Avatar from "../common/Avatar";
import { buildFileURL } from "../../utils/buildFileURL";
import { getInitials } from "../../utils/getInitials";
import { getFileType } from "../../utils/getFileType";
import { File } from "../../types/File";
import { usePostCommentsSectionContext } from "../../contexts/PostCommentSectionProvider";
import Image from "../common/Image";
import { FaFileAlt } from "react-icons/fa";
import {
  getReadableCommentUploadDate,
  timeDifference
} from "../../utils/timeDifference";

export default function Comment({ message }: { message: Message }) {
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
            {message.author.firstName} {message.author.lastName}{" "}
          </span>
          <span className="italic">
            {getReadableCommentUploadDate(timeDifference(message.createdAt))}
          </span>
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
          error: "bg-slate-200 font-semibold"
        }}
        errorContent="Error loading image."
      />
    );

  if (type === "video")
    return (
      <video className="h-40 w-40 object-cover" controls>
        <source
          src={buildFileURL(file.url, { type: "chat-message", id: chat.id })}
        />
        Your browser does not support the video tag.
      </video>
    );

  return (
    <div className="h-40 w-40 overflow-hidden bg-slate-200 px-4 py-8 dark:bg-slate-800">
      <FaFileAlt size={20} />
      <p className="mt-2 text-sm font-semibold">{file.url}</p>
    </div>
  );
}
