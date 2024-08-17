import React from "react";
import Message from "./Message";
import { useChatContext } from "../../contexts/ChatProvider";

export default function ChatContent() {
  const { messages } = useChatContext();

  if (!messages) throw new Error();

  return (
    <div className="no-scrollbar h-[calc(100vh-14rem)] overflow-auto rounded-tl-lg bg-slate-100 px-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
