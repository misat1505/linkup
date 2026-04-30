import AuthGuard from "@/components/auth-guard";
import { getMeCached } from "@/features/auth/actions/get-me";
import { getChatByIdCached } from "@/features/chats/actions/get-chat-by-id";
import { getChatsCached } from "@/features/chats/actions/get-chats";
import Chat from "@/features/chats/components/chat";
import ChatNavigation from "@/features/chats/components/chat-navigation";
import ChatPageProvider from "@/features/chats/providers/chat-page-provider";
import { prefetchFirstPage } from "@/features/chats/utils/prefetch-first-page";
import { makeQueryClient } from "@/lib/make-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const queryClient = makeQueryClient();
  const id = (await params).id;

  const [allChats, chat] = await Promise.all([
    getChatsCached(),
    getChatByIdCached(id),
    prefetchFirstPage(queryClient, id),
    getMeCached(),
  ]);

  if (!chat) throw new Error("Chat not found");

  return (
    <AuthGuard>
      <ChatPageProvider chats={allChats}>
        <div className="flex h-[calc(100vh-5rem)] w-screen">
          <ChatNavigation />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Chat chat={chat} />
          </HydrationBoundary>
        </div>
      </ChatPageProvider>
    </AuthGuard>
  );
}
