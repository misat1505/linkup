import { Message as MessageType } from "../../models/Message";
import React from "react";
import Message from "./Message";

export default function ChatContent({ messages }: { messages: MessageType[] }) {
  return (
    <div className="no-scrollbar h-[calc(100vh-14rem)] overflow-auto rounded-tl-lg bg-slate-100 px-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
