import { FaArrowDown } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { usePostCommentsSectionContext } from "../../contexts/PostCommentSectionProvider";
import Tooltip from "../common/Tooltip";
import { useQuery, useQueryClient } from "react-query";
import { queryKeys } from "../../lib/queryKeys";
import { ChatService } from "../../services/Chat.service";
import { Message } from "@/types/Message";

export default function PostCommentSection() {
  const { isCommentSectionOpen } = usePostCommentsSectionContext();

  return (
    <div>
      <CommentSectionOpenButton />
      {isCommentSectionOpen && <CommentSection group={null} />}
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
        className="hover:bg-post-dark/20 dark:hover:bg-post-light/20 mt-4 flex w-full justify-center rounded-md p-4 transition-all hover:opacity-50"
        onClick={toggleIsCommentSectionOpen}
      >
        <FaArrowDown className={cn({ "rotate-180": isCommentSectionOpen })} />
      </button>
    </Tooltip>
  );
}

function CommentSection({ group }: { group: string | null }) {
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

  if (isLoading) return <div>loading...</div>;

  return (
    <>
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          <div className="flex items-center justify-between p-2">
            <p>{message.content}</p>
            <button onClick={() => toggleIsMessageActive(message.id)}>
              responses
            </button>
          </div>
          {activeMessages.includes(message.id) && (
            <CommentSection group={message.id} key={message.id} />
          )}
        </React.Fragment>
      ))}
    </>
  );
}
