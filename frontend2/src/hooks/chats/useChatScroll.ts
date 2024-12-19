import { useChatContext } from "../../contexts/ChatProvider";
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
  const { messages } = useChatContext();

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
    if (container) {
      if (isInitialMount.current) {
        bottomRef.current?.scrollIntoView();
        isInitialMount.current = false;
      } else {
        if (wasAtBottomRef.current) {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          container.scrollTop = scrollTopRef.current;
        }
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return {
    containerRef,
    handleScroll,
    bottomRef,
    wasAtBottomRef,
    scrollToBottom
  };
}
