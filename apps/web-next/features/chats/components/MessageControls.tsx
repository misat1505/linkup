import { I18nText } from "@/components/shared/I18nText";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Message } from "@packages/schemas";
import { RiReplyFill } from "react-icons/ri";
import { useChatFooterContext } from "../providers/ChatFooterProvider";
import ReactionCreator from "./ReactionCreator";

type MessageControlsProps = { message: Message };

export default function MessageControls({ message }: MessageControlsProps) {
  const { setResponse } = useChatFooterContext();

  return (
    <div className="hidden group-hover:block">
      <div className="flex items-center gap-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <RiReplyFill
                size={20}
                className="text-muted-foreground transition-all hover:cursor-pointer hover:text-slate-400"
                onClick={() => setResponse(message.id)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <I18nText translationKey="chats.message.controls.reply.tooltip" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ReactionCreator message={message} />
      </div>
    </div>
  );
}
