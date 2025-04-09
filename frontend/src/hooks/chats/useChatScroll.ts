import { useChatContext } from "@/contexts/ChatProvider";
import { useLayoutEffect, useRef } from "react";

type useChatScrollValue = {
  containerRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
  bottomRef: React.RefObject<HTMLDivElement>;
  wasAtBottomRef: React.MutableRefObject<boolean>;
  scrollToBottom: () => void;
};

export default function useChatScroll(): useChatScrollValue {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef<number>(0);
  const isInitialMount = useRef<boolean>(true);
  const wasAtBottomRef = useRef<boolean>(true);
  const { messages, isFetchingNextPage } = useChatContext();
  const prevScrollHeightRef = useRef<number>(0);

  const handleScroll = () => {
    if (containerRef.current) {
      scrollTopRef.current = containerRef.current.scrollTop;
      const container = containerRef.current;
      const atBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      wasAtBottomRef.current = atBottom;
    }
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isInitialMount.current) {
      bottomRef.current?.scrollIntoView();
      isInitialMount.current = false;
      prevScrollHeightRef.current = container.scrollHeight;
      return;
    }

    if (isFetchingNextPage) {
      prevScrollHeightRef.current = container.scrollHeight;
      return;
    }

    const newScrollHeight = container.scrollHeight;
    const heightDiff = newScrollHeight - prevScrollHeightRef.current;

    if (heightDiff > 0 && !wasAtBottomRef.current) {
      container.scrollTop = scrollTopRef.current + heightDiff;
    } else if (wasAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevScrollHeightRef.current = newScrollHeight;
  }, [messages, isFetchingNextPage]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return {
    containerRef,
    handleScroll,
    bottomRef,
    wasAtBottomRef,
    scrollToBottom,
  };
}
