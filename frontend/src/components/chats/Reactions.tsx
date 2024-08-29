import { Reaction } from "../../types/Reaction";
import { Message } from "../../types/Message";
import React from "react";
import { IoMdHappy, IoMdHeart } from "react-icons/io";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { TbMoodCry } from "react-icons/tb";
import { FaSkull } from "react-icons/fa";
import Tooltip from "../common/Tooltip";
import { useAppContext } from "../../contexts/AppProvider";
import { cn } from "../../lib/utils";
import { ChatUtils } from "../../utils/chatUtils";
import { useChatContext } from "../../contexts/ChatProvider";
import { createFullName } from "../../utils/createFullName";

export default function Reactions({
  reactions
}: {
  reactions: Message["reactions"];
}) {
  return (
    <div className="no-scrollbar mb-2 flex max-w-60 items-center gap-x-1 overflow-auto rounded-sm bg-slate-300 p-1 dark:bg-slate-700">
      {reactions.map((reaction, id) => (
        <ReactionItem reaction={reaction} key={id} />
      ))}
    </div>
  );
}

const commonClasses = "h-4 w-4";

export const reactionsMap = {
  happy: <IoMdHappy className={cn("text-yellow-500", commonClasses)} />,
  sad: <HiOutlineEmojiSad className={cn("text-yellow-500", commonClasses)} />,
  crying: <TbMoodCry className={cn("text-yellow-500", commonClasses)} />,
  heart: <IoMdHeart className={cn("text-red-500", commonClasses)} />,
  skull: <FaSkull className={cn("text-black", commonClasses)} />
};

function ReactionItem({ reaction }: { reaction: Reaction }) {
  const { chat } = useChatContext();
  const { user: me } = useAppContext();
  const component =
    reactionsMap[reaction.name as keyof typeof reactionsMap] || null;

  if (!component) return null;

  const utils = new ChatUtils(chat!, me!);

  const getTooltipText = (): string => {
    if (reaction.user.id === me!.id) return "You";

    const name = utils.getDisplayNameById(reaction.user.id);
    return name || createFullName(reaction.user);
  };

  return (
    <Tooltip content={getTooltipText()}>
      <span>{component}</span>
    </Tooltip>
  );
}
