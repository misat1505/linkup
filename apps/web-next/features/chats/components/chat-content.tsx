"use client";

import Loading from "@/components/shared/loading";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import useChatScroll from "../hooks/use-chat-scroll";
import { useChatContext } from "../providers/chat-provider";
import ChatStarted from "./chat-started";
import IncomeMessage from "./income-message";
import { MessageWrapper } from "./message-wrapper";

export default function ChatContent() {
  const {
    messages,
    isLoading,
    incomeMessage,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useChatContext();
  const {
    bottomRef,
    containerRef,
    handleScroll,
    wasAtBottomRef,
    scrollToBottom,
  } = useChatScroll();

  const { ref: topRef, inView } = useInView();

  const lastFetchRef = useRef(0);

  useEffect(() => {
    const now = Date.now();

    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      now - lastFetchRef.current > 1000
    ) {
      lastFetchRef.current = now;
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const styles =
    "flex-grow overflow-hidden bg-slate-100 dark:bg-slate-900 pt-2 relative";

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
        data-testid="cy-chat-messages"
        className="max-h-full overflow-auto px-4 dark:scheme-dark"
      >
        <div ref={topRef} className="h-2"></div>
        {!hasNextPage && <ChatStarted />}
        {[...messages].reverse().map((message) => (
          <MessageWrapper key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
      {/*eslint-disable-next-line react-hooks/refs*/}
      {incomeMessage && !wasAtBottomRef.current && (
        <IncomeMessage
          key={incomeMessage.id}
          message={incomeMessage}
          onclick={scrollToBottom}
        />
      )}
    </div>
  );
}
