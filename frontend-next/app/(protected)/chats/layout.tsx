import ChatNavigation from "@/features/chats/components/ChatNavigation";
import ChatPageProvider from "@/features/chats/providers/ChatPageProvider";

export default function ChatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatPageProvider>
      <div className="flex h-[calc(100vh-5rem)] w-screen">
        <ChatNavigation />
        {children}
      </div>
    </ChatPageProvider>
  );
}
