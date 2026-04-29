import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { Message } from "@packages/schemas";
import { RiReplyFill } from "react-icons/ri";
import { useChatContext } from "../providers/chat-provider";
import { MessageUtils } from "../utils/message-utils";

type ResponseTextProps = { message: Message };

export default function ResponseText({ message }: ResponseTextProps) {
  const { t } = useLanguageContext();
  const { user: me } = useAppContext();
  const { chat } = useChatContext();
  if (!me || !chat) throw new Error();

  const utils = new MessageUtils(chat, message, me, t);

  return (
    <div className="flex items-center gap-x-2">
      <RiReplyFill size={14} className="text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{utils.getResponseText()}</p>
    </div>
  );
}
