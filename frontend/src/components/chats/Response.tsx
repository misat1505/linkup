import { createFullName } from "../../utils/createFullName";
import { Message } from "../../models/Message";
import React from "react";
import { useAppContext } from "../../contexts/AppProvider";
import { useChatContext } from "../../contexts/ChatProvider";

type ResponseProps = { message: Omit<Message, "response"> };

export default function Response({ message }: ResponseProps) {
  const { messageRefs } = useChatContext();
  const { user: me } = useAppContext();

  const getText = () => {
    if (message.content) return message.content.substring(0, 20);
    if (me!.id === message.author.id)
      return `You sent ${message.files.length} file(s).`;

    const { firstName, lastName } = message.author;
    return `${createFullName({ firstName, lastName })} sent ${message.files.length} file(s).`;
  };

  const onclick = () => {
    messageRefs.current[message.id]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      onClick={onclick}
      className="w-fit rounded-t-md rounded-br-md bg-black p-2 text-muted-foreground shadow-lg transition-all hover:cursor-pointer hover:text-slate-400"
      style={{ boxShadow: "0 10px black" }}
    >
      {getText()}
    </div>
  );
}
