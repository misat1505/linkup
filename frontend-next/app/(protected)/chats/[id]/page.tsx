import { getChatByIdCached } from "@/features/chats/actions/getChatById";
import Chat from "@/features/chats/components/Chat";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const chat = await getChatByIdCached(id);
  if (!chat) throw new Error("Chat not found");

  return <Chat chat={chat} />;
}
