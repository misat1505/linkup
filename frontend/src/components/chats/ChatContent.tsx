import React, { useEffect, useLayoutEffect, useRef } from "react";
import Message from "./Message";
import { useChatContext } from "../../contexts/ChatProvider";
import Loading from "../common/Loading";
import IncomeMessage from "./IncomeMessage";

export default function ChatContent() {
  const { messages, isLoading, incomeMessage } = useChatContext();
  const bottomRef = useRef<HTMLDivElement>(null);
  const styles =
    "flex-grow overflow-hidden rounded-tl-lg bg-slate-100 pt-2 relative";

  useLayoutEffect(() => {
    if (!messages) return;

    bottomRef.current?.scrollIntoView();
  }, [messages]);

  if (isLoading)
    return (
      <div className={styles}>
        <Loading />
      </div>
    );

  if (!messages) throw new Error();

  return (
    <div className={styles}>
      <div className="max-h-full overflow-auto px-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
      {incomeMessage && <IncomeMessage message={incomeMessage} />}
    </div>
  );
}
