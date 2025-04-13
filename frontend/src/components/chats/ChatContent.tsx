import { useChatContext } from "@/contexts/ChatProvider";
import useChatScroll from "@/hooks/chats/useChatScroll";
import Loading from "../common/Loading";
import Message from "./Message";
import IncomeMessage from "./IncomeMessage";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import ChatStarted from "./ChatStarted";
import useChangeTabTitle from "@/hooks/useChangeTabTitle";
import { ChatUtils } from "@/utils/chatUtils";
import { useAppContext } from "@/contexts/AppProvider";
import { useTranslation } from "react-i18next";

export default function ChatContent() {
  const { t } = useTranslation();
  const { user: me } = useAppContext();
  const {
    messages,
    isLoading,
    incomeMessage,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    chat,
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

  const utils = new ChatUtils(chat!, me!);

  useChangeTabTitle(t("tabs.chats", { name: utils.getChatName() }));

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
        {!hasNextPage && <ChatStarted />}
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
