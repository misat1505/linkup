import { getChatMessages } from "../../api/chatAPI";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function ChatGuard() {
  const { chatId } = useParams();

  if (!chatId) return <div className="flex-grow">No chat selected.</div>;

  return <Chat chatId={chatId} />;
}

function Chat({ chatId }: { chatId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["messages", { chatId }],
    queryFn: () => getChatMessages(chatId)
  });

  if (isLoading) return <div className="flex-grow">loading...</div>;

  if (error)
    return (
      <div className="relative flex-grow">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-100 p-4">
          Chat unavailable.
        </div>
      </div>
    );

  return <div className="flex-grow">{JSON.stringify(data)}</div>;
}
