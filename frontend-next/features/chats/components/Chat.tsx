import ChatHeader from "./ChatHeader";
import ChatFooterProvider from "@/contexts/ChatFooterProvider";
import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import { Chat as ChatType } from "../schemas/chat";

type ChatProps = { chat: ChatType };

export default function Chat({ chat }: ChatProps) {
  return (
    <div className="w-[calc(100vw-20rem)] grow">
      <div className="flex h-full w-full flex-col">
        <ChatHeader chat={chat} />
        {/*<ChatFooterProvider chatId={chatId}>
          <ChatContent />
          <ChatFooter />
        </ChatFooterProvider>*/}
      </div>
    </div>
  );
}
