import { useAppContext } from "@/contexts/app-provider";
import { useChatContext } from "@/contexts/chat-provider";
import useChatScroll from "@/hooks/chats/use-chat-scroll";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { ChatUtils } from "@/utils/chat-utils";
import { ChatStarted } from "@packages/ui/components/features/chats/chat-started";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import Loading from "../common/loading";
import IncomeMessage from "./income-message";
import { MessageWrapper } from "./message-wrapper";

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
        {!hasNextPage && <ChatStarted chat={chat!} me={me!} />}
        {[...messages].reverse().map((message) => (
          <MessageWrapper key={message.id} message={message} />
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
