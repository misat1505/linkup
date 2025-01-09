import ChatPageContent from "@/components/chats/ChatPageContent";
import ChatPageProvider from "@/contexts/ChatPageProvider";

export default function Chats() {
  return (
    <div className="flex h-[calc(100vh-5rem)] w-screen">
      <ChatPageProvider>
        <ChatPageContent />
      </ChatPageProvider>
    </div>
  );
}
