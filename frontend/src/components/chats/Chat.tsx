import { getChatMessages } from "../../api/chatAPI";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function ChatGuard() {
  const { chatId } = useParams();

  if (!chatId) return <div>No chat selected.</div>;

  return <Chat chatId={chatId} />;
}

function Chat({ chatId }: { chatId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["messages", { chatId }],
    queryFn: () => getChatMessages(chatId)
  });

  if (isLoading) return <div>loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}
