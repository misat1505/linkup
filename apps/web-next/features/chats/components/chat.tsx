import { Chat as ChatType } from "@packages/schemas";
import ChatFooterProvider from "../providers/chat-footer-provider";
import ChatProvider from "../providers/chat-provider";
import ChatContent from "./chat-content";
import ChatFooter from "./chat-footer";
import ChatHeader from "./chat-header";

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
