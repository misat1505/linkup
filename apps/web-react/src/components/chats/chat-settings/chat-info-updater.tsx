import Loading from "@/components/common/loading";
import { useChatContext } from "@/contexts/chat-provider";
import { queryKeys } from "@/lib/query-keys";
import { ChatService } from "@/services/chat.service";
import { FileService } from "@/services/file.service";
import { buildFileURL } from "@/utils/build-file-url";
import { sortChatsByActivity } from "@/utils/sort-chats-by-activity";
import { Chat } from "@packages/schemas";
import { Updater } from "@packages/ui/components/features/chats/chat-settings/chat-info-updater";
import { useQuery, useQueryClient } from "react-query";

export default function ChatInfoUpdater() {
  const { chat } = useChatContext();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.downloadFile(chat!.photoURL!),
    queryFn: () =>
      FileService.downloadFile(
        buildFileURL(chat!.photoURL, { type: "chat-photo", id: chat!.id }),
        chat!.photoURL,
      ),
  });

  if (isLoading)
    return (
      <div className="relative h-32 w-full">
        <Loading />
      </div>
    );
  return <UpdaterWrapper file={data || null} />;
}

function UpdaterWrapper({ file }: { file: File | null }) {
  const queryClient = useQueryClient();
  const { chat } = useChatContext();

  function cb(updatedChat: Chat) {
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (!oldChats) return [];

      const filteredChats = oldChats.filter((c) => c.id !== chat!.id);
      filteredChats.push(updatedChat);
      return sortChatsByActivity(filteredChats);
    });
  }

  return (
    <Updater
      chat={chat!}
      file={file}
      updateChatAction={ChatService.updateChat}
      updateChatCb={cb}
    />
  );
}
