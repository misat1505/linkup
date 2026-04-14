import { useAppContext } from "@/contexts/AppProvider";
import { useChatContext } from "@/contexts/ChatProvider";
import { Message } from "@/types/Message";
import { MessageUtils } from "@/utils/messageUtils";
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
