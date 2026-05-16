import { Chat, Message, Reaction, User } from "@packages/schemas";
import { FaSkull } from "react-icons/fa";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { IoMdHappy, IoMdHeart } from "react-icons/io";
import { TbMoodCry } from "react-icons/tb";
import { TRANSLATION_COMPONENT } from "../../../config";
import { cn } from "../../../lib/utils";
import { ChatUtils } from "../../../utils/chat-utils";
import { createFullName } from "../../../utils/create-full-name";
import { Tooltip } from "../../misc/tooltip";

type ReactionsProps = Omit<ReactionItemProps, "reaction"> & {
	reactions: Message["reactions"];
};

export function Reactions(props: ReactionsProps) {
	return (
		<div className="no-scrollbar mb-2 flex max-w-60 items-center gap-x-1 overflow-auto rounded-sm bg-slate-300 p-1 dark:bg-slate-700">
			{props.reactions.map((reaction, id) => (
				<ReactionItem {...props} reaction={reaction} key={id} />
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

type ReactionItemProps = {
	reaction: Reaction;
	chat: Chat;
	me: User;
};

function ReactionItem({ reaction, chat, me }: ReactionItemProps) {
	const component = reactionsMap[reaction.name as keyof typeof reactionsMap] || null;

	if (!component) return null;

	const utils = new ChatUtils(chat!, me!);

	const getTooltipText = (): React.ReactNode => {
		if (reaction.user.id === me!.id) return <TRANSLATION_COMPONENT translationKey="common.you" />;

		const name = utils.getDisplayNameById(reaction.user.id);
		return name || createFullName(reaction.user);
	};

	return (
		<Tooltip content={getTooltipText()}>
			<span>{component}</span>
		</Tooltip>
	);
}
