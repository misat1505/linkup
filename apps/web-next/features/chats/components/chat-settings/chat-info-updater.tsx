"use client";
import Loading from "@/components/shared/loading";
import { downloadFile } from "@/features/files/actions/download-file";
import { queryKeys } from "@/lib/query-keys";
import { useAppContext } from "@/providers/app-provider";
import { buildFileURL } from "@/utils/build-file-url";
import { Chat } from "@packages/schemas";
import { Updater } from "@packages/ui/components/features/chats/chat-settings/chat-info-updater";
import { useQuery } from "@tanstack/react-query";
import { updateChat } from "../../actions/update-chat";

type ChatInfoUpdaterProps = {
  chat: Chat;
};

export default function ChatInfoUpdater({ chat }: ChatInfoUpdaterProps) {
  const { user: me } = useAppContext();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.downloadFile(me!.photoURL!),
    queryFn: async () => {
      if (!me!.photoURL) return null;

      const data = await downloadFile(
        buildFileURL(chat.photoURL, { type: "chat-photo", id: chat.id }),
      );
      if (!data) return null;

      const file = new File([data.buffer], me!.photoURL, {
        type: data.type,
      });

      return file;
    },
  });

  if (isLoading)
    return (
      <div className="relative h-32 w-full">
        <Loading />
      </div>
    );

  return (
    <Updater chat={chat!} file={data ?? null} updateChatAction={updateChat} />
  );
}
