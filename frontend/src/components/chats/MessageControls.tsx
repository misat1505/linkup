import { Message } from "../../models/Message";
import React from "react";
import { RiReplyFill } from "react-icons/ri";
import { useChatFooterContext } from "../../contexts/ChatFooterProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../ui/tooltip";

type MessageControlsProps = { message: Message };

export default function MessageControls({ message }: MessageControlsProps) {
  const { setResponse } = useChatFooterContext();

  return (
    <div className="hidden group-hover:block">
      <div className="flex items-center gap-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <RiReplyFill
                size={20}
                className="text-muted-foreground transition-all hover:cursor-pointer hover:text-slate-400"
                onClick={() => setResponse(message.id)}
              />
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <RiReplyFill
          size={20}
          className="text-muted-foreground transition-all hover:cursor-pointer hover:text-slate-400"
          onClick={() => setResponse(message.id)}
        /> */}
      </div>
    </div>
  );
}
