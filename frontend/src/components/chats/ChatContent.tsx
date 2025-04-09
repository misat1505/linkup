import { useChatContext } from "@/contexts/ChatProvider";
import useChatScroll from "@/hooks/chats/useChatScroll";
import Loading from "../common/Loading";
import Message from "./Message";
import IncomeMessage from "./IncomeMessage";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

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

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
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
        className="max-h-full overflow-auto px-4 dark:[color-scheme:dark]"
      >
        <div ref={topRef} className="h-2"></div>
        {[...messages].reverse().map((message) => (
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
