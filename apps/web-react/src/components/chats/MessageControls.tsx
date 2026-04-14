import { useChatFooterContext } from "@/contexts/ChatFooterProvider";
import { Message } from "@/types/Message";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { RiReplyFill } from "react-icons/ri";
import ReactionCreator from "./ReactionCreator";
import { useTranslation } from "react-i18next";

type MessageControlsProps = { message: Message };

export default function MessageControls({ message }: MessageControlsProps) {
  const { t } = useTranslation();
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
              {t("chats.message.controls.reply.tooltip")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ReactionCreator message={message} />
      </div>
    </div>
  );
}
