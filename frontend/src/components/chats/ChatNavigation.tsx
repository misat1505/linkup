import { getUserChats } from "../../api/chatAPI";
import React from "react";
import { useQuery } from "react-query";

export default function ChatNavigation() {
  const { data, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getUserChats
  });

  if (isLoading) return <div>loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}
