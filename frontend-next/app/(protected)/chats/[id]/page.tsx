import { getChatByIdCached } from "@/features/chats/actions/getChatById";
import { getChatsCached } from "@/features/chats/actions/getChats";
import Chat from "@/features/chats/components/Chat";
import ChatNavigation from "@/features/chats/components/ChatNavigation";
import ChatPageProvider from "@/features/chats/providers/ChatPageProvider";
import { prefetchFirstPage } from "@/features/chats/utils/prefetchFirstPage";
import { makeQueryClient } from "@/lib/makeQueryClient";
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
  ]);

  if (!chat) throw new Error("Chat not found");

  return (
    <ChatPageProvider chats={allChats}>
      <div className="flex h-[calc(100vh-5rem)] w-screen">
        <ChatNavigation />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Chat chat={chat} />
        </HydrationBoundary>
      </div>
    </ChatPageProvider>
  );
}
