import { useAppContext } from "../../contexts/AppProvider";
import { Message } from "../../models/Message";
import React from "react";
import { RiReplyFill } from "react-icons/ri";

type ResponseTextProps = { message: Message };

export default function ResponseText({ message }: ResponseTextProps) {
  const { user: me } = useAppContext();

  const getText = (): string => {
    const { author: messageAuthor } = message;
    const { author: responseAuthor } = message.response!;

    if (messageAuthor.id === me!.id) {
      if (responseAuthor.id === me!.id) return `You replied to yourself.`;
      return `You replied to ${responseAuthor.firstName} ${responseAuthor.lastName}.`;
    }

    if (responseAuthor.id === me!.id)
      return `${messageAuthor.firstName} ${messageAuthor.lastName} replied to you.`;

    if (responseAuthor.id === messageAuthor.id)
      return `${messageAuthor.firstName} ${messageAuthor.lastName} replied to themselves.`;
    return `${messageAuthor.firstName} ${messageAuthor.lastName} replied to ${responseAuthor.firstName} ${responseAuthor.lastName}.`;
  };

  return (
    <div className="flex items-center gap-x-2">
      <RiReplyFill size={14} className="text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{getText()}</p>
    </div>
  );
}
