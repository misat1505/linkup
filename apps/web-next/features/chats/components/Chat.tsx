import ChatHeader from "./ChatHeader";
import { Chat as ChatType } from "../schemas/chat";
import ChatFooter from "./ChatFooter";
import ChatFooterProvider from "../providers/ChatFooterProvider";
import ChatProvider from "../providers/ChatProvider";
import ChatContent from "./ChatContent";

type ChatProps = { chat: ChatType };

export default function Chat({ chat }: ChatProps) {
  return (
    <ChatProvider chat={chat}>
      <div className="w-[calc(100vw-20rem)] grow">
        <div className="flex h-full w-full flex-col">
          <ChatHeader chat={chat} />
          <ChatFooterProvider chatId={chat.id}>
            <ChatContent />
            <ChatFooter />
          </ChatFooterProvider>
        </div>
      </div>
    </ChatProvider>
  );
}
