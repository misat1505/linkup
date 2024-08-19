import React, { useEffect, useLayoutEffect, useRef } from "react";
import Message from "./Message";
import { useChatContext } from "../../contexts/ChatProvider";
import { cn } from "../../lib/utils";
import Loading from "../common/Loading";

export default function ChatContent() {
  const { messages, isLoading } = useChatContext();
  const bottomRef = useRef<HTMLDivElement>(null);
  const styles = "flex-grow overflow-auto rounded-tl-lg bg-slate-100 px-4 pt-2";

  useLayoutEffect(() => {
    if (!messages) return;

    bottomRef.current?.scrollIntoView();
  }, [messages]);

  if (isLoading)
    return (
      <div className={cn(styles, "relative")}>
        <Loading />
      </div>
    );

  if (!messages) throw new Error();

  return (
    <div className={styles}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
