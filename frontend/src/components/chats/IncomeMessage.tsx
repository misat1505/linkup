import { useAppContext } from "@/contexts/AppProvider";
import { useChatContext } from "@/contexts/ChatProvider";
import useDelay from "@/hooks/useDelay";
import { cn } from "@/lib/utils";
import styles from "@/styles/incomeMessage.module.css";
import { Message } from "@/types/Message";
import { ChatUtils } from "@/utils/chatUtils";
import { useState } from "react";
import Avatar from "../common/Avatar";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";

type IncomeMessageProps = {
  message: Message;
  onclick: () => void;
};

export default function IncomeMessage({
  message,
  onclick,
}: IncomeMessageProps) {
  const [isClicked, setIsClicked] = useState(false);
  const { user: me } = useAppContext();
  const { chat } = useChatContext();

  if (!chat || !me) throw new Error();

  const utils = new ChatUtils(chat, me);
  const displayName = utils.getDisplayNameById(message.author.id)!;

  const getText = (): string => {
    if (message.content)
      return `${displayName}: ${message.content.substring(0, 20)}`;
    return `${displayName} sent ${message.files.length} file(s).`;
  };

  const handleClick = () => {
    setIsClicked(true);
    onclick();
  };

  useDelay(() => setIsClicked(true), 5000);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-x-4 rounded-md bg-slate-300 p-4 transition-all hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600",
        styles.incomeMessage,
        { hidden: isClicked }
      )}
    >
      <Avatar
        src={buildFileURL(message.author.photoURL, { type: "avatar" })}
        alt={getInitials(message.author)}
        className="h-8 w-8 text-xs"
      />
      <div className="font-semibold">{getText()}</div>
    </button>
  );
}
