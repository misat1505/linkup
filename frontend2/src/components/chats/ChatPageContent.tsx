import React from "react";
import ChatNavigation from "./ChatNavigation";
import Chat from "./Chat";
import { useChatPageContext } from "../../contexts/ChatPageProvider";
import Loading from "../common/Loading";

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
