import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { IoMdHappy, IoMdHeart } from "react-icons/io";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { TbMoodCry } from "react-icons/tb";
import { FaSkull } from "react-icons/fa";
import { MdAddReaction } from "react-icons/md";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import { I18nText } from "@/components/shared/I18nText";
import Tooltip from "@/components/shared/Tooltip";
import { Message } from "../schemas/message";
import { useAppContext } from "@/providers/AppProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useChatContext } from "../providers/ChatProvider";
import { TranslationPath } from "@/providers/LanguageProvider";
import { createReaction } from "../actions/createReaction";

export default function ReactionCreator({ message }: { message: Message }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setIsOpen(true)}>
          <Tooltip
            content={
              <I18nText translationKey="chats.message.controls.reaction.trigger.tooltip" />
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
            <I18nText translationKey="chats.message.controls.reaction.title" />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <ReactionCreatorContent message={message} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}

type ReactionType = { id: string; name: string };

function ReactionCreatorContent({
  message,
  setIsOpen,
}: {
  message: Message;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user: me } = useAppContext();
  const queryClient = useQueryClient();

  if (message.reactions.find((r) => r.user.id === me!.id))
    return (
      <div>
        <I18nText translationKey="chats.message.controls.reaction.already-reacted" />
      </div>
    );

  const availbleReactions = queryClient.getQueryData<ReactionType[]>(
    queryKeys.reactions(),
  );

  if (!availbleReactions)
    return (
      <div>
        <I18nText translationKey="chats.message.controls.reaction.not-available" />
      </div>
    );

  return (
    <div className="mx-auto my-4 flex items-center gap-x-2 px-8">
      {availbleReactions.map((reaction) => (
        <ReactionCreatorContentItem
          reaction={reaction}
          messageId={message.id}
          key={reaction.id}
          setIsOpen={setIsOpen}
        />
      ))}
    </div>
  );
}

const commonClasses = "h-8 w-8";

export const reactionsMap = {
  happy: <IoMdHappy className={cn("text-yellow-500", commonClasses)} />,
  sad: <HiOutlineEmojiSad className={cn("text-yellow-500", commonClasses)} />,
  crying: <TbMoodCry className={cn("text-yellow-500", commonClasses)} />,
  heart: <IoMdHeart className={cn("text-red-500", commonClasses)} />,
  skull: <FaSkull className={cn("text-black", commonClasses)} />,
};

function ReactionCreatorContentItem({
  reaction,
  messageId,
  setIsOpen,
}: {
  reaction: ReactionType;
  messageId: Message["id"];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { chat, setIncomeMessageId, addReaction } = useChatContext();
  const component =
    reactionsMap[reaction.name as keyof typeof reactionsMap] || null;

  if (!component) return null;

  const handleClick = async () => {
    try {
      const reactionResponse = await createReaction(
        messageId,
        reaction.id,
        chat!.id,
      );

      addReaction(reactionResponse);

      // socketClient.sendReaction(reactionResponse, chat!.id);

      setIsOpen(false);
      setIncomeMessageId(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Tooltip
      content={
        <I18nText
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
