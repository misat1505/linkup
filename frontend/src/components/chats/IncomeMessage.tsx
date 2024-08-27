import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { Message } from "../../types/Message";
import { getInitials } from "../../utils/getInitials";
import styles from "../../styles/incomeMessage.module.css";
import { cn } from "../../lib/utils";
import useDelay from "../../hooks/useDelay";
import { buildFileURL } from "../../utils/buildFileURL";

type IncomeMessageProps = {
  message: Message;
  onclick: () => void;
};

export default function IncomeMessage({
  message,
  onclick
}: IncomeMessageProps) {
  const [isClicked, setIsClicked] = useState(false);
  const { firstName, lastName } = message.author;

  const getText = (): string => {
    if (message.content)
      return `${firstName} ${lastName}: ${message.content.substring(0, 20)}`;
    return `${firstName} ${lastName} sent ${message.files.length} file(s).`;
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
        "absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-x-4 rounded-md bg-slate-300 p-4 transition-all hover:bg-slate-400",
        styles.incomeMessage,
        { hidden: isClicked }
      )}
    >
      <Avatar
        src={buildFileURL(message.author.photoURL, "avatar")}
        alt={getInitials(message.author)}
        className="h-8 w-8 text-xs"
      />
      <div className="font-semibold">{getText()}</div>
    </button>
  );
}
