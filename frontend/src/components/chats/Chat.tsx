import React from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import ChatProvider, { useChatContext } from "../../contexts/ChatProvider";
import { useChatPageContext } from "../../contexts/ChatPageProvider";
import ChatFooterProvider from "../../contexts/ChatFooterProvider";

export default function ChatGuard() {
  const { chatId } = useParams();

  if (!chatId) return <div className="flex-grow">No chat selected.</div>;

  return (
    <ChatProvider key={chatId} chatId={chatId}>
      <Chat />
    </ChatProvider>
  );
}

function Chat() {
  const { error, chatId } = useChatContext();
  const { chats } = useChatPageContext();

  const isUserInChat = chats?.find((c) => c.id === chatId);

  if (error || !isUserInChat)
    return (
      <div className="relative flex-grow">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-100 p-4">
          Chat unavailable.
        </div>
      </div>
    );

  return (
    <div className="flex-grow">
      <div className="flex h-full w-full flex-col">
        <ChatHeader chatId={chatId} />
        <ChatFooterProvider chatId={chatId}>
          <ChatContent />
          <ChatFooter />
        </ChatFooterProvider>
      </div>
    </div>
  );
}
