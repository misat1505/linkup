import React, { useLayoutEffect, useRef } from "react";
import Message from "./Message";
import { useChatContext } from "../../contexts/ChatProvider";
import Loading from "../common/Loading";
import IncomeMessage from "./IncomeMessage";
import useChatScroll from "../../hooks/chats/useChatScroll";

export default function ChatContent() {
  const { messages, isLoading, incomeMessage } = useChatContext();
  const { bottomRef, containerRef, handleScroll } = useChatScroll();
  // const containerRef = useRef<HTMLDivElement>(null);
  // const bottomRef = useRef<HTMLDivElement>(null);
  // const scrollTopRef = useRef<number>(0);
  // const isInitialMount = useRef<boolean>(true);
  // const wasAtBottomRef = useRef<boolean>(true);

  const styles =
    "flex-grow overflow-hidden rounded-tl-lg bg-slate-100 pt-2 relative";

  // const handleScroll = () => {
  //   if (containerRef.current) {
  //     scrollTopRef.current = containerRef.current.scrollTop;
  //     const container = containerRef.current;
  //     const atBottom =
  //       container.scrollHeight - container.scrollTop === container.clientHeight;
  //     wasAtBottomRef.current = atBottom;
  //   }
  // };

  // useLayoutEffect(() => {
  //   const container = containerRef.current;
  //   if (container) {
  //     if (isInitialMount.current) {
  //       bottomRef.current?.scrollIntoView();
  //       isInitialMount.current = false;
  //     } else {
  //       if (wasAtBottomRef.current) {
  //         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  //       } else {
  //         container.scrollTop = scrollTopRef.current;
  //       }
  //     }
  //   }
  // }, [messages]);

  if (isLoading) {
    return (
      <div className={styles}>
        <Loading />
      </div>
    );
  }

  if (!messages) {
    throw new Error("Messages data is not available");
  }

  return (
    <div className={styles}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="max-h-full overflow-auto px-4"
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
      {incomeMessage && <IncomeMessage message={incomeMessage} />}
    </div>
  );
}
