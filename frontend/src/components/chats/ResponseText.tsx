import { MessageUtils } from "../../utils/messageUtils";
import { useAppContext } from "../../contexts/AppProvider";
import { Message } from "../../models/Message";
import React from "react";
import { RiReplyFill } from "react-icons/ri";

type ResponseTextProps = { message: Message };

export default function ResponseText({ message }: ResponseTextProps) {
  const { user: me } = useAppContext();
  if (!me) throw new Error();

  const utils = new MessageUtils(message, me);

  return (
    <div className="flex items-center gap-x-2">
      <RiReplyFill size={14} className="text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{utils.getResponseText()}</p>
    </div>
  );
}
