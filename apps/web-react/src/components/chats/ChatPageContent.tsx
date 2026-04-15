import { useChatPageContext } from "@/contexts/ChatPageProvider";
import Loading from "../common/Loading";
import ChatNavigation from "./ChatNavigation";
import Chat from "./Chat";

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
