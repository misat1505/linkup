import { Message } from "../../models/Message";
import { useChatContext } from "../../contexts/ChatProvider";
import React from "react";
import { RiReplyFill } from "react-icons/ri";

type MessageControlsProps = { message: Message };

export default function MessageControls({ message }: MessageControlsProps) {
  const { setResponseId } = useChatContext();

  return (
    <div className="hidden group-hover:block">
      <div className="flex items-center gap-x-4">
        <RiReplyFill
          size={20}
          className="text-muted-foreground transition-all hover:cursor-pointer hover:text-slate-400"
          onClick={() => setResponseId(message.id)}
        />
      </div>
    </div>
  );
}
