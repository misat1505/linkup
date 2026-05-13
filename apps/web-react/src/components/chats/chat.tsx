import ChatFooterProvider from "@/contexts/chat-footer-provider";
import { useChatPageContext } from "@/contexts/chat-page-provider";
import ChatProvider, { useChatContext } from "@/contexts/chat-provider";
import { ChatError } from "@packages/ui/components/features/chats/chat-error";
import { NoActiveChat } from "@packages/ui/components/features/chats/no-active-chat";
import { useParams } from "react-router-dom";
import ChatContent from "./chat-content";
import ChatFooter from "./chat-footer";
import ChatHeaderWrapper from "./chat-header-wrapper";
import { Trigger } from "./create-chat-trigger";

export default function ChatGuard() {
  const { chatId } = useParams();

  if (!chatId) return <NoActiveChat slots={{ trigger: Trigger }} />;

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

  if (error || !isUserInChat) return <ChatError />;

  return (
    <div className="w-[calc(100vw-20rem)] flex-grow">
      <div className="flex h-full w-full flex-col">
        <ChatHeaderWrapper chatId={chatId} />
        <ChatFooterProvider chatId={chatId}>
          <ChatContent />
          <ChatFooter />
        </ChatFooterProvider>
      </div>
    </div>
  );
}
