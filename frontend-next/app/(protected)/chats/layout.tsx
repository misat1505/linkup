import { getChatsCached } from "@/features/chats/actions/getChats";
import ChatNavigation from "@/features/chats/components/ChatNavigation";
import ChatPageProvider from "@/features/chats/providers/ChatPageProvider";

export default async function ChatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chats = await getChatsCached();

  return (
    <ChatPageProvider chats={chats}>
      <div className="flex h-[calc(100vh-5rem)] w-screen">
        <ChatNavigation />
        {children}
      </div>
    </ChatPageProvider>
  );
}
