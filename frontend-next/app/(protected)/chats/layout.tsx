import ChatNavigation from "@/features/chats/components/ChatNavigation";

export default function ChatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[calc(100vh-5rem)] w-screen">
      <ChatNavigation />
      {children}
    </div>
  );
}
