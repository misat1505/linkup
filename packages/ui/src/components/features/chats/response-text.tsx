import { Chat, Message, User } from "@packages/schemas";
import { RiReplyFill } from "react-icons/ri";
import { useUiPackageContext } from "../../../config";
import { MessageUtils } from "../../../utils/message-utils";

type ResponseTextProps = { message: Message; chat: Chat; me: User };

export function ResponseText({ message, me, chat }: ResponseTextProps) {
  const { t } = useUiPackageContext();
  if (!me || !chat) throw new Error();

  const utils = new MessageUtils(chat, message, me, t);

  return (
    <div className="flex items-center gap-x-2">
      <RiReplyFill size={14} className="text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{utils.getResponseText()}</p>
    </div>
  );
}
