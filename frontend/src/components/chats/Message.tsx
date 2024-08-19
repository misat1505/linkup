import { useAppContext } from "../../contexts/AppProvider";
import { Message as MessageType } from "../../models/Message";
import React from "react";
import { cn } from "../../lib/utils";
import MultimediaDisplay from "./MultimediaDisplay";

export default function Message({ message }: { message: MessageType }) {
  const { user: me } = useAppContext();

  if (!me) throw new Error();

  const isMine = message.author.id === me.id;

  return (
    <div
      className={cn("flex w-full", {
        "justify-start": !isMine,
        "justify-end": isMine
      })}
    >
      <MultimediaDisplay files={message.files} />

      <div
        className={cn("mb-1 w-fit max-w-[75%] rounded-md px-2 py-1", {
          "bg-blue-500 text-white": isMine,
          "bg-slate-200": !isMine
        })}
      >
        {message.content}
      </div>
    </div>
  );
}
