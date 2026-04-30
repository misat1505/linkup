import { useAppContext } from "@/contexts/app-provider";
import { useChatContext } from "@/contexts/chat-provider";
import { MessageUtils } from "@/utils/message-utils";
import { Message } from "@packages/schemas";
import { useTranslation } from "react-i18next";
import { RiReplyFill } from "react-icons/ri";

type ResponseTextProps = { message: Message };

export default function ResponseText({ message }: ResponseTextProps) {
  const { t } = useTranslation();
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
