import React from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import ChatProvider, { useChatContext } from "../../contexts/ChatProvider";
import Loading from "../common/Loading";

export default function ChatGuard() {
  const { chatId } = useParams();

  if (!chatId) return <div className="flex-grow">No chat selected.</div>;

  return (
    <ChatProvider chatId={chatId}>
      <Chat />
    </ChatProvider>
  );
}

function Chat() {
  const { isLoading, error, chat, chatId } = useChatContext();

  // if (isLoading)
  //   return (
  //     <div className="relative flex-grow">
  //       <Loading />
  //     </div>
  //   );

  if (error)
    return (
      <div className="relative flex-grow">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-100 p-4">
          Chat unavailable.
        </div>
      </div>
    );

  return (
    <div className="flex-grow">
      <ChatHeader chatId={chatId} />
      <ChatContent />
      <ChatFooter chatId={chatId} />
    </div>
  );
}
