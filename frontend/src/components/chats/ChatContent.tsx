import { Message } from "../../models/Message";
import React from "react";

export default function ChatContent({ messages }: { messages: Message[] }) {
  return (
    <div className="h-[calc(100vh-224px)]">{JSON.stringify(messages)}</div>
  );
}
