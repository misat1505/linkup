import { useAppContext } from "@/contexts/app-provider";
import { useChatContext } from "@/contexts/chat-provider";
import { queryKeys } from "@/lib/query-keys";
import { ChatService } from "@/services/chat.service";
import { Chat, UserInChat } from "@packages/schemas";
import { AliasUpdateModal } from "@packages/ui/components/features/chats/chat-settings/alias-update-modal";
import { ChatMembersDisplayItem } from "@packages/ui/components/features/chats/chat-settings/chat-members-displayer";
import { useQueryClient } from "react-query";

export default function ChatMembersDisplayerWrapper() {
  const queryClient = useQueryClient();
  const { user: me } = useAppContext();
  const { chat } = useChatContext();
  if (!chat) throw new Error();

  function cb(updatedChat: Chat) {
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (oldChats?.find((c) => c.id === updatedChat.id)) return oldChats;
      return oldChats ? [...oldChats, updatedChat] : [updatedChat];
    });
  }

  const users = chat.users!;

  return (
    <div className="my-4 w-full">
      {users.map((user) => (
        <ChatMembersDisplayItem
          key={user.id}
          chat={chat}
          user={user}
          me={me!}
          createPrivateChatAction={ChatService.createPrivateChat}
          createPrivateChatCb={cb}
          slots={{
            aliasUpdateModal: <AliasUpdateModalWrapper user={user} />,
          }}
        />
      ))}
    </div>
  );
}

function AliasUpdateModalWrapper({ user }: { user: UserInChat }) {
  const queryClient = useQueryClient();
  const { chatId } = useChatContext();

  function cb(text: UserInChat["alias"]) {
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (!oldChats) return [];

      const chat = oldChats.find((chat) => chat.id === chatId)!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const cacheUser = chat.users?.find((u) => u.id === user.id)!;
      cacheUser.alias = text;

      return [...oldChats];
    });
  }

  return (
    <AliasUpdateModal
      user={user}
      chatId={chatId as string}
      updateAliasAction={ChatService.updateAlias}
      updateAliasCb={cb}
    />
  );
}
