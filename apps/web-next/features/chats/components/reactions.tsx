import { IoMdHappy, IoMdHeart } from "react-icons/io";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { TbMoodCry } from "react-icons/tb";
import { FaSkull } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { createFullName } from "@/utils/create-full-name";
import { Message, Reaction } from "@packages/schemas";
import { useChatContext } from "../providers/chat-provider";
import { useAppContext } from "@/providers/app-provider";
import { ChatUtils } from "../utils/chat-utils";
import { I18nText } from "@/components/shared/i18n-text";
import Tooltip from "@/components/shared/tooltip";

export default function Reactions({
  reactions,
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
  skull: <FaSkull className={cn("text-black", commonClasses)} />,
};

function ReactionItem({ reaction }: { reaction: Reaction }) {
  const { chat } = useChatContext();
  const { user: me } = useAppContext();
  const component =
    reactionsMap[reaction.name as keyof typeof reactionsMap] || null;

  if (!component) return null;

  const utils = new ChatUtils(chat!, me!);

  const getTooltipText = (): React.ReactNode => {
    if (reaction.user.id === me!.id)
      return <I18nText translationKey="common.you" />;

    const name = utils.getDisplayNameById(reaction.user.id);
    return name || createFullName(reaction.user);
  };

  return (
    <Tooltip content={getTooltipText()}>
      <span>{component}</span>
    </Tooltip>
  );
}
