import React from "react";
import Message from "./Message";
import { useChatContext } from "../../contexts/ChatProvider";
import Loading from "../common/Loading";
import IncomeMessage from "./IncomeMessage";
import useChatScroll from "../../hooks/chats/useChatScroll";

export default function ChatContent() {
  const { messages, isLoading, incomeMessage } = useChatContext();
  const {
    bottomRef,
    containerRef,
    handleScroll,
    wasAtBottomRef,
    scrollToBottom
  } = useChatScroll();

  const styles =
    "flex-grow overflow-hidden md:rounded-tl-lg bg-slate-100 dark:bg-slate-900 pt-2 relative";

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
        className="max-h-full overflow-auto px-4 dark:[color-scheme:dark]"
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
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