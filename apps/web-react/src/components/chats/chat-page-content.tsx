import { useChatPageContext } from "@/contexts/chat-page-provider";
import { Loading } from "@packages/ui/components/misc/loading";
import Chat from "./chat";
import ChatNavigation from "./chat-navigation";

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
