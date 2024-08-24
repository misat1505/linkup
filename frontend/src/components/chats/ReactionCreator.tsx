import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import Tooltip from "../common/Tooltip";
import { MdAddReaction } from "react-icons/md";
import { Message } from "../../models/Message";
import { IoMdHappy, IoMdHeart } from "react-icons/io";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { TbMoodCry } from "react-icons/tb";
import { FaSkull } from "react-icons/fa";
import { cn } from "../../lib/utils";
import { useAppContext } from "../../contexts/AppProvider";
import { useQueryClient } from "react-query";
import { queryKeys } from "../../lib/queryKeys";
import { useChatContext } from "../../contexts/ChatProvider";
import { ChatService } from "../../services/Chat.service";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function ReactionCreator({ message }: { message: Message }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
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
        <ReactionCreatorContent message={message} />
      </DialogContent>
    </Dialog>
  );
}

type ReactionType = { id: string; name: string };

function ReactionCreatorContent({ message }: { message: Message }) {
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
  skull: <FaSkull className={cn("text-black", commonClasses)} />
};

function ReactionCreatorContentItem({
  reaction,
  messageId
}: {
  reaction: ReactionType;
  messageId: Message["id"];
}) {
  const queryClient = useQueryClient();
  const { chat } = useChatContext();
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
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Tooltip content={reaction.name}>
      <button onClick={handleClick}>{component}</button>
    </Tooltip>
  );
}
