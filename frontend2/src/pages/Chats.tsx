import React from "react";
import ChatPageProvider from "../contexts/ChatPageProvider";
import ChatPageContent from "../components/chats/ChatPageContent";

export default function Chats() {
  return (
    <div className="flex h-[calc(100vh-5rem)] w-screen">
      <ChatPageProvider>
        <ChatPageContent />
      </ChatPageProvider>
    </div>
  );
}
