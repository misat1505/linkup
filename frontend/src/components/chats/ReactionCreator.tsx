import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { IoMdHappy, IoMdHeart } from "react-icons/io";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { TbMoodCry } from "react-icons/tb";
import { FaSkull } from "react-icons/fa";
import { Message } from "@/types/Message";
import Tooltip from "../common/Tooltip";
import { MdAddReaction } from "react-icons/md";
import { useAppContext } from "@/contexts/AppProvider";
import { useQueryClient } from "react-query";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/contexts/ChatProvider";
import { ChatService } from "@/services/Chat.service";
import { socketClient } from "@/lib/socketClient";

export default function ReactionCreator({ message }: { message: Message }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setIsOpen(true)}>
          <Tooltip content="Create reaction">
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
          <DialogTitle>Create your reaction</DialogTitle>
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
    return <div>You have already created reaction for this message.</div>;

  const availbleReactions = queryClient.getQueryData<ReactionType[]>(
    queryKeys.reactions()
  );

  if (!availbleReactions)
    return <div>Reacting is not available at the moment.</div>;

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
  const queryClient = useQueryClient();
  const { chat, setIncomeMessageId } = useChatContext();
  const component =
    reactionsMap[reaction.name as keyof typeof reactionsMap] || null;

  if (!component) return null;

  const handleClick = async () => {
    try {
      const reactionResponse = await ChatService.createReaction(
        messageId,
        reaction.id,
        chat!.id
      );

      queryClient.setQueryData<Message[]>(
        queryKeys.messages(chat!.id),
        (oldMessages = []) => {
          const message = oldMessages.find((m) => m.id === messageId);
          if (!message) return oldMessages;

          message.reactions.push(reactionResponse);
          return [...oldMessages];
        }
      );

      socketClient.sendReaction(reactionResponse, chat!.id);

      setIsOpen(false);
      setIncomeMessageId(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Tooltip content={reaction.name}>
      <span>
        <DialogFooter>
          <button onClick={handleClick}>{component}</button>
        </DialogFooter>
      </span>
    </Tooltip>
  );
}
