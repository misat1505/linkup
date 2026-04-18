import Avatar from "@/components/shared/Avatar";
import { I18nText } from "@/components/shared/I18nText";
import useDelay from "@/hooks/useDelay";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/AppProvider";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";
import { Message } from "@packages/schemas";
import { useState } from "react";
import { useChatContext } from "../providers/ChatProvider";
import { ChatUtils } from "../utils/chatUtils";
import styles from "./styles/incomeMessage.module.css";

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

  const getText = (): React.ReactNode => {
    if (message.content)
      return (
        <I18nText
          translationKey="chats.income-message.text"
          values={{
            name: displayName,
            text: message.content.substring(0, 20),
          }}
        />
      );
    return (
      <I18nText
        translationKey="chats.income-message.only-files"
        values={{
          name: displayName,
          count: String(message.files.length),
        }}
      />
    );
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
        { hidden: isClicked },
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
