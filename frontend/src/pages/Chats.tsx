import BgGradient from "../components/common/BgGradient";
import Chat from "../components/chats/Chat";
import ChatNavigation from "../components/chats/ChatNavigation";
import React from "react";
import ChatPageProvider from "../contexts/ChatPageProvider";

export default function Chats() {
  return (
    <BgGradient>
      <div className="mt-20 flex h-[calc(100vh-5rem)]">
        <ChatPageProvider>
          <ChatNavigation />
          <Chat />
        </ChatPageProvider>
      </div>
    </BgGradient>
  );
}
