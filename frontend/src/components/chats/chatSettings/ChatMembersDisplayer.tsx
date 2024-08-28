import Avatar from "../../../components/common/Avatar";
import { useChatContext } from "../../../contexts/ChatProvider";
import { Chat, UserInChat } from "../../../types/Chat";
import React, { useState } from "react";
import { buildFileURL } from "../../../utils/buildFileURL";
import { createFullName } from "../../../utils/createFullName";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { ChatService } from "../../../services/Chat.service";
import { useQueryClient } from "react-query";
import { queryKeys } from "../../../lib/queryKeys";

export default function ChatMembersDisplayer() {
  const { chat } = useChatContext();
  if (!chat) throw new Error();

  const users = chat.users!;

  return (
    <div className="w-full">
      {users.map((user) => (
        <ChatMemberDisplayItem key={user.id} user={user} />
      ))}
    </div>
  );
}

function ChatMemberDisplayItem({ user }: { user: UserInChat }) {
  const queryClient = useQueryClient();
  const { chatId } = useChatContext();
  const [text, setText] = useState(user.alias);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const inputValue = e.target.value;

    setText(inputValue === "" ? null : inputValue);
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();

      await ChatService.updateAlias(chatId, user.id, text);

      queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
        if (!oldChats) return [];

        const chat = oldChats.find((chat) => chat.id === chatId)!;
        const cacheUser = chat.users?.find((u) => u.id === user.id)!;
        cacheUser.alias = text;

        return [...oldChats];
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex w-full items-center gap-x-2 p-4 text-xs">
      <Avatar
        src={buildFileURL(user.photoURL, "avatar")}
        alt
        className="h-8 w-8"
      />
      <div>
        <p className="mb-2">{createFullName(user)}</p>
        <Input
          value={text || ""}
          placeholder="Create alias"
          className="p-1"
          onChange={handleChange}
        />
      </div>
      <Button variant="blueish" onClick={handleClick}>
        Save
      </Button>
    </div>
  );
}
