import AuthGuard from "@/components/auth-guard";
import { getChatsCached } from "@/features/chats/actions/get-chats";
import ChatNavigation from "@/features/chats/components/chat-navigation";
import { CreateChatTrigger } from "@/features/chats/components/create-chat-trigger";
import ChatPageProvider from "@/features/chats/providers/chat-page-provider";
import { NoActiveChat } from "@packages/ui/components/features/chats/no-active-chat";

export default async function ChatsPage() {
  const chats = await getChatsCached();

  return (
    <AuthGuard>
      <ChatPageProvider chats={chats}>
        <div className="flex h-[calc(100vh-5rem)] w-screen">
          <ChatNavigation />
          <NoActiveChat slots={{ trigger: CreateChatTrigger }} />
        </div>
      </ChatPageProvider>
    </AuthGuard>
  );
}
