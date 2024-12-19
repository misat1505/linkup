import { useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import UserDisplay from "./UserDisplay";
import useUserSearch from "@/hooks/useUserSearch";
import { useAppContext } from "@/contexts/AppProvider";
import { User } from "@/types/User";
import { ChatService } from "@/services/Chat.service";
import { Chat } from "@/types/Chat";
import { queryKeys } from "@/lib/queryKeys";
import { ROUTES } from "@/lib/routes";
import { Input } from "@/components/ui/input";

export default function PrivateChatForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const { data } = useUserSearch(text);
  const { user: me } = useAppContext();

  const handleClick =
    (user: User) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      const chat = await ChatService.createPrivateChat(me!.id, user.id);

      queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
        if (oldChats?.find((c) => c.id === chat.id)) return oldChats;
        return oldChats ? [...oldChats, chat] : [chat];
      });
      navigate(ROUTES.CHAT_DETAIL.$buildPath({ params: { chatId: chat.id } }));
    };

  return (
    <div className="mx-auto max-w-72">
      <Input
        placeholder="Search for people..."
        className="mb-2 mt-4"
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <div className="no-scrollbar max-h-[400px] overflow-auto">
        {data?.map((user) => (
          <UserDisplay user={user} key={user.id} onClick={handleClick(user)} />
        ))}
      </div>
    </div>
  );
}
