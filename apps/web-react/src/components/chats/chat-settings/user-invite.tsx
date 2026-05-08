import { useChatContext } from "@/contexts/chat-provider";
import useUserSearch from "@/hooks/use-user-search";
import { queryKeys } from "@/lib/query-keys";
import { ChatService } from "@/services/chat.service";
import { Chat, UserInChat } from "@packages/schemas";
import { UserSearchDisplayer } from "@packages/ui/components/features/chats/chat-settings/user-invite";
import { Input } from "@packages/ui/components/shadcn/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";

export default function UserInvite() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const { data } = useUserSearch(text);
  const { chat } = useChatContext();
  const queryClient = useQueryClient();

  const filteredUsers = data?.filter(
    (user) => !chat!.users!.some((u) => u.id === user.id),
  );

  function cb(newUser: UserInChat) {
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (!oldChats) return [];

      const updatedChat = oldChats.find((c) => c.id === chat!.id)!;
      updatedChat.users?.push(newUser);
      return [...oldChats];
    });
  }

  return (
    <div>
      <Input
        placeholder={t("chats.settings.group.invite.search.placeholder")}
        className="my-2"
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <UserSearchDisplayer
        users={filteredUsers}
        chatId={chat!.id}
        addUserToChatAction={ChatService.addUserToChat}
        addUserToChatCb={cb}
      />
    </div>
  );
}
