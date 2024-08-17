import { useChatPageContext } from "../../contexts/ChatPageProvider";
import { getChatMessages } from "../../api/chatAPI";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";

export default function ChatGuard() {
  const { chatId } = useParams();

  if (!chatId) return <div className="flex-grow">No chat selected.</div>;

  return <Chat chatId={chatId} />;
}

function Chat({ chatId }: { chatId: string }) {
  const { isLoading: chatsLoading, getChatById } = useChatPageContext();
  const {
    data: messages,
    isLoading,
    error
  } = useQuery({
    queryKey: ["messages", { chatId }],
    queryFn: () => getChatMessages(chatId)
  });

  if (isLoading || chatsLoading)
    return <div className="flex-grow">loading...</div>;

  const chat = getChatById(chatId);

  if (error || !chat)
    return (
      <div className="relative flex-grow">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-100 p-4">
          Chat unavailable.
        </div>
      </div>
    );

  return (
    <div className="flex-grow">
      <ChatHeader chat={chat} />
      <ChatContent messages={messages!} />
      <ChatFooter />
    </div>
  );
}
