import { FaArrowDown, FaReply } from "react-icons/fa";
import React, { useState } from "react";
import { usePostCommentsSectionContext } from "@/contexts/PostCommentSectionProvider";
import PostCommentForm from "./PostCommentForm";
import Tooltip from "../common/Tooltip";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppProvider";
import { useQuery } from "react-query";
import { queryKeys } from "@/lib/queryKeys";
import { ChatService } from "@/services/Chat.service";
import { Message } from "@/types/Message";
import Comment from "./Comment";
import { useTranslation } from "react-i18next";
import { createFullName } from "@/utils/createFullName";

export default function PostCommentSection() {
  const { isCommentSectionOpen } = usePostCommentsSectionContext();

  return (
    <div>
      <CommentSectionOpenButton />
      {isCommentSectionOpen && (
        <div>
          <CommentSection group={null} level={1} />
          <PostCommentForm />
        </div>
      )}
    </div>
  );
}

function CommentSectionOpenButton() {
  const { t } = useTranslation();
  const { isCommentSectionOpen, toggleIsCommentSectionOpen } =
    usePostCommentsSectionContext();

  const tooltipText = isCommentSectionOpen
    ? t("posts.comments.section.close")
    : t("posts.comments.section.open");

  return (
    <Tooltip content={tooltipText}>
      <button
        className={cn(
          "mt-4 flex w-full justify-center rounded-md p-4 transition-all hover:bg-post-dark/20 hover:opacity-50 dark:hover:bg-post-light/20",
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
  level,
}: {
  group: string | null;
  level: number;
}) {
  const { t } = useTranslation();
  const { chat, setResponse } = usePostCommentsSectionContext();
  const { user: me } = useAppContext();
  const { data: messages = [] } = useQuery({
    queryKey: queryKeys.messages(chat.id, group),
    queryFn: () => ChatService.getMessages(chat.id, group),
    refetchOnMount: false,
  });

  const [activeMessages, setActiveMessages] = useState<Message["id"][]>([]);

  const toggleIsMessageActive = (id: Message["id"]) => {
    setActiveMessages((prevMessages) => {
      if (prevMessages.includes(id))
        return prevMessages.filter((m) => m !== id);
      return [...prevMessages, id];
    });
  };

  const getTooltipText = (message: Message): string => {
    const name =
      message.author.id === me!.id
        ? t("posts.comments.tooltip.you")
        : createFullName(message.author);

    return t("posts.comments.tooltip.messageInfo", {
      name,
      date: message.createdAt.toLocaleDateString(
        t("posts.comments.tooltip.locale")
      ),
      time: message.createdAt.toLocaleTimeString(
        t("posts.comments.tooltip.locale")
      ),
    });
  };

  return (
    <>
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          <Tooltip content={getTooltipText(message)}>
            <div className="group flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
              <div className="ml-1 flex flex-grow gap-x-2 overflow-hidden">
                <LevelIndicator level={level} />
                <Comment message={message} />
              </div>
              <div className="flex items-center gap-x-2">
                <ResponseSetButton
                  isActive={activeMessages.includes(message.id)}
                  onclick={() => setResponse(message)}
                />
                <ToggleSubsectionOpenButton
                  isActive={activeMessages.includes(message.id)}
                  onclick={() => toggleIsMessageActive(message.id)}
                />
              </div>
            </div>
          </Tooltip>
          {activeMessages.includes(message.id) && (
            <CommentSection group={message.id} level={level + 1} />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

function ResponseSetButton({
  isActive,
  onclick,
}: {
  isActive: boolean;
  onclick: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Tooltip content={t("posts.comments.buttons.reply.tooltip")}>
      <button onClick={onclick}>
        <FaReply
          className={cn(
            "transition-all group-hover:text-slate-600 group-hover:hover:text-slate-400 dark:group-hover:text-slate-400 dark:group-hover:hover:text-slate-600",
            {
              "text-slate-600 dark:text-slate-400": isActive,
              "text-transparent": !isActive,
            }
          )}
        />
      </button>
    </Tooltip>
  );
}

function ToggleSubsectionOpenButton({
  isActive,
  onclick,
}: {
  isActive: boolean;
  onclick: () => void;
}) {
  const { t } = useTranslation();

  const tooltipText = isActive
    ? t("posts.comments.buttons.reduce.tooltip")
    : t("posts.comments.buttons.extend.tooltip");

  return (
    <Tooltip content={tooltipText}>
      <button onClick={onclick} className="p-2">
        <FaArrowDown
          className={cn(
            "transition-all group-hover:text-slate-600 group-hover:hover:text-slate-400 dark:group-hover:text-slate-400 dark:group-hover:hover:text-slate-600",
            {
              "rotate-180 text-slate-400 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-600":
                isActive,
              "text-transparent": !isActive,
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
