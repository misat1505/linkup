import React from "react";
import Avatar from "../common/Avatar";
import { Message } from "../../models/Message";
import { API_URL } from "../../constants";
import { getInitials } from "../../utils/getInitials";
import styles from "../../styles/incomeMessage.module.css";
import { cn } from "../../lib/utils";

export default function IncomeMessage({ message }: { message: Message }) {
  const { firstName, lastName } = message.author;

  const getText = (): string => {
    if (message.content)
      return `${firstName} ${lastName}: ${message.content.substring(0, 20)}`;
    return `${firstName} ${lastName} sent ${message.files.length} file(s).`;
  };

  return (
    <div
      key={message.id}
      className={cn(
        "absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-x-4 rounded-md bg-slate-300 p-4",
        styles.incomeMessage
      )}
    >
      <Avatar
        src={`${API_URL}/files/${message.author.photoURL}`}
        alt={getInitials({ firstName, lastName })}
        className="h-8 w-8 text-xs"
      />
      <div className="font-semibold">{getText()}</div>
    </div>
  );
}
