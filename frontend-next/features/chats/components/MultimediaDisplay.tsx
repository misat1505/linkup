import { getFileType } from "@/utils/getFileType";
import { buildFileURL } from "@/utils/buildFileURL";
import { File } from "../schemas/file";
import { useChatContext } from "../providers/ChatProvider";
import Image from "@/components/shared/Image";
import ProtectedVideo from "@/components/shared/ProtectedVideo";
import ProtectedFile from "@/components/shared/ProtectedFile";

export default function MultimediaDisplay({ files }: { files: File[] }) {
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
  const { chatId } = useChatContext();

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
