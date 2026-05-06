import React, { useState } from "react";
import { FaSkull } from "react-icons/fa";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { IoMdHappy, IoMdHeart } from "react-icons/io";
import { MdAddReaction } from "react-icons/md";
import { TbMoodCry } from "react-icons/tb";
import { TRANSLATION_COMPONENT } from "../../../config";
import { cn } from "../../../lib/utils";
import { TranslationPath } from "../../../utils/i18n";
import { Tooltip } from "../../misc/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/dialog";

type ReactionType = { id: string; name: string };

export type ReactionCreatorProps = {
  alreadyReacted: boolean;
  availableReactions: ReactionType[] | null;
  onReact: (reactionId: ReactionType["id"]) => Promise<void>;
};

const commonClasses = "h-8 w-8";

export const reactionsMap = {
  happy: <IoMdHappy className={cn("text-yellow-500", commonClasses)} />,
  sad: <HiOutlineEmojiSad className={cn("text-yellow-500", commonClasses)} />,
  crying: <TbMoodCry className={cn("text-yellow-500", commonClasses)} />,
  heart: <IoMdHeart className={cn("text-red-500", commonClasses)} />,
  skull: <FaSkull className={cn("text-black", commonClasses)} />,
};

export function ReactionCreator({
  alreadyReacted,
  availableReactions,
  onReact,
}: ReactionCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setIsOpen(true)}>
          <Tooltip
            content={
              <TRANSLATION_COMPONENT translationKey="chats.message.controls.reaction.trigger.tooltip" />
            }
          >
            <span>
              <MdAddReaction
                size={20}
                className="text-muted-foreground transition-all hover:cursor-pointer hover:text-slate-400"
              />
            </span>
          </Tooltip>
        </button>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle>
            <TRANSLATION_COMPONENT translationKey="chats.message.controls.reaction.title" />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <ReactionCreatorContent
          alreadyReacted={alreadyReacted}
          availableReactions={availableReactions}
          onReact={onReact}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

type ReactionCreatorContentProps = Pick<
  ReactionCreatorProps,
  "alreadyReacted" | "availableReactions" | "onReact"
> & {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function ReactionCreatorContent({
  alreadyReacted,
  availableReactions,
  onReact,
  setIsOpen,
}: ReactionCreatorContentProps) {
  if (alreadyReacted)
    return (
      <div>
        <TRANSLATION_COMPONENT translationKey="chats.message.controls.reaction.already-reacted" />
      </div>
    );

  if (!availableReactions)
    return (
      <div>
        <TRANSLATION_COMPONENT translationKey="chats.message.controls.reaction.not-available" />
      </div>
    );

  return (
    <div className="mx-auto my-4 flex items-center gap-x-2 px-8">
      {availableReactions.map((reaction) => (
        <ReactionCreatorItem
          key={reaction.id}
          reaction={reaction}
          onReact={onReact}
          setIsOpen={setIsOpen}
        />
      ))}
    </div>
  );
}

type ReactionCreatorItemProps = {
  reaction: ReactionType;
  onReact: ReactionCreatorProps["onReact"];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function ReactionCreatorItem({
  reaction,
  onReact,
  setIsOpen,
}: ReactionCreatorItemProps) {
  const component =
    reactionsMap[reaction.name as keyof typeof reactionsMap] ?? null;

  if (!component) return null;

  const handleClick = async () => {
    try {
      await onReact(reaction.id);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Tooltip
      content={
        <TRANSLATION_COMPONENT
          translationKey={
            `chats.message.controls.reaction.values.${reaction.name}` as TranslationPath
          }
        />
      }
    >
      <span>
        <DialogFooter>
          <button onClick={handleClick}>{component}</button>
        </DialogFooter>
      </span>
    </Tooltip>
  );
}

// export function ReactionCreatorContainer({ message, chat }) {
//   const { user: me } = useAppContext();
//   const queryClient = useQueryClient();

//   return (
//     <ReactionCreator
//       alreadyReacted={message.reactions.some((r) => r.user.id === me!.id)}
//       availableReactions={queryClient.getQueryData(queryKeys.reactions()) ?? null}
//       onReact={async (reactionId) => {
//         const reaction = await createReaction(message.id, reactionId, chat.id);
//         socketClient.sendReaction(reaction, chat.id);
//       }}
//     />
//   );
// }
