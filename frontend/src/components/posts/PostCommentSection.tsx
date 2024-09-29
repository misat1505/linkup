import { FaArrowDown } from "react-icons/fa";
import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { usePostCommentsSectionContext } from "../../contexts/PostCommentSectionProvider";
import Tooltip from "../common/Tooltip";
import { useQuery } from "react-query";
import { queryKeys } from "../../lib/queryKeys";
import { ChatService } from "../../services/Chat.service";
import { Message } from "../../types/Message";

export default function PostCommentSection() {
  const { isCommentSectionOpen } = usePostCommentsSectionContext();

  return (
    <div>
      <CommentSectionOpenButton />
      {isCommentSectionOpen && <CommentSection group={null} level={1} />}
    </div>
  );
}

function CommentSectionOpenButton() {
  const { isCommentSectionOpen, toggleIsCommentSectionOpen } =
    usePostCommentsSectionContext();

  const tooltipText = isCommentSectionOpen ? "Close comments" : "Open comments";

  return (
    <Tooltip content={tooltipText}>
      <button
        className={cn(
          "hover:bg-post-dark/20 dark:hover:bg-post-light/20 mt-4 flex w-full justify-center rounded-md p-4 transition-all hover:opacity-50",
          { "my-4": isCommentSectionOpen }
        )}
        onClick={toggleIsCommentSectionOpen}
      >
        <FaArrowDown className={cn({ "rotate-180": isCommentSectionOpen })} />
      </button>
    </Tooltip>
  );
}

function CommentSection({
  group,
  level
}: {
  group: string | null;
  level: number;
}) {
  const { chat } = usePostCommentsSectionContext();
  const { isLoading, data: messages = [] } = useQuery({
    queryKey: queryKeys.messages(chat.id, group),
    queryFn: () => ChatService.getMessages(chat.id, group)
  });

  const [activeMessages, setActiveMessages] = useState<Message["id"][]>([]);

  const toggleIsMessageActive = (id: Message["id"]) => {
    setActiveMessages((prevMessages) => {
      if (prevMessages.includes(id))
        return prevMessages.filter((m) => m !== id);
      return [...prevMessages, id];
    });
  };

  // if (isLoading) return <div>loading...</div>;

  return (
    <>
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          <div className="flex items-center justify-between">
            <div className="flex gap-x-2">
              <LevelIndicator level={level} />
              <Comment message={message} />
            </div>
            <ToggleSubsectionOpenButton
              isActive={activeMessages.includes(message.id)}
              onclick={() => toggleIsMessageActive(message.id)}
            />
          </div>
          {activeMessages.includes(message.id) && (
            <CommentSection group={message.id} level={level + 1} />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

function ToggleSubsectionOpenButton({
  isActive,
  onclick
}: {
  isActive: boolean;
  onclick: () => void;
}) {
  return (
    <Tooltip content={isActive ? "Close replies" : "Show replies"}>
      <button onClick={onclick} className="p-2">
        <FaArrowDown
          className={cn(
            "transition-all hover:text-slate-600 dark:hover:text-slate-400",
            {
              "rotate-180 text-slate-300 hover:text-slate-400 dark:text-slate-600 dark:hover:text-slate-500":
                isActive
            }
          )}
        />
      </button>
    </Tooltip>
  );
}

function LevelIndicator({ level }: { level: number }) {
  return (
    <div className="flex gap-x-1 self-stretch">
      {new Array(level).fill(0).map((_, idx) => (
        <div
          key={idx}
          className="w-0.5 self-stretch bg-slate-400 dark:bg-slate-600"
        />
      ))}
    </div>
  );
}

function Comment({ message }: { message: Message }) {
  return <p className="p-2">{message.content}</p>;
}
