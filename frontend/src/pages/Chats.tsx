import BgGradient from "../components/common/BgGradient";
import React from "react";
import ChatPageProvider from "../contexts/ChatPageProvider";
import ChatPageContent from "../components/chats/ChatPageContent";

export default function Chats() {
  return (
    <>
      <BgGradient />
      <div className="relative z-10 flex h-[calc(100vh-5rem)] w-screen">
        <ChatPageProvider>
          <ChatPageContent />
        </ChatPageProvider>
      </div>
    </>
  );
}
