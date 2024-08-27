import { Reaction } from "../../types/Reaction";
import { Message } from "../../types/Message";
import React from "react";
import { IoMdHappy, IoMdHeart } from "react-icons/io";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { TbMoodCry } from "react-icons/tb";
import { FaSkull } from "react-icons/fa";
import Tooltip from "../common/Tooltip";
import { createFullName } from "../../utils/createFullName";
import { useAppContext } from "../../contexts/AppProvider";
import { cn } from "../../lib/utils";

export default function Reactions({
  reactions
}: {
  reactions: Message["reactions"];
}) {
  return (
    <div className="no-scrollbar mb-2 flex max-w-60 items-center gap-x-1 overflow-auto rounded-sm bg-slate-300 p-1">
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
  const { user: me } = useAppContext();
  const component =
    reactionsMap[reaction.name as keyof typeof reactionsMap] || null;

  if (!component) return null;

  const tooltipText =
    reaction.user.id === me!.id ? "You" : createFullName(reaction.user);

  return (
    <Tooltip content={tooltipText}>
      <span>{component}</span>
    </Tooltip>
  );
}
