import { useChatPageContext } from "@/contexts/chat-page-provider";
import Loading from "../common/loading";
import ChatNavigation from "./chat-navigation";
import Chat from "./chat";

export default function ChatPageContent() {
  const { isLoading } = useChatPageContext();

  if (isLoading) return <Loading />;

  return (
    <>
      <ChatNavigation />
      <Chat />
    </>
  );
}
