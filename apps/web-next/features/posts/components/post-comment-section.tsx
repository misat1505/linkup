import { I18nText } from "@/components/shared/i18n-text";
import Tooltip from "@/components/shared/tooltip";
import { getMessages } from "@/features/chats/actions/get-messages";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { createFullName } from "@/utils/create-full-name";
import { Message } from "@packages/schemas";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaArrowDown, FaReply } from "react-icons/fa";
import { usePostCommentsSectionContext } from "../providers/post-comment-section-provider";
import Comment from "./comment";
import PostCommentForm from "./post-comment-form";

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
  const { isCommentSectionOpen, toggleIsCommentSectionOpen } =
    usePostCommentsSectionContext();

  const tooltipText = isCommentSectionOpen ? (
    <I18nText translationKey="posts.comments.section.close" />
  ) : (
    <I18nText translationKey="posts.comments.section.open" />
  );

  return (
    <Tooltip content={tooltipText}>
      <button
        className={cn(
          "mt-4 flex w-full justify-center rounded-md p-4 transition-all hover:bg-post-dark/20 hover:opacity-50 dark:hover:bg-post-light/20",
          { "my-4": isCommentSectionOpen },
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
  const { t } = useLanguageContext();
  const { chat, setResponse } = usePostCommentsSectionContext();
  const { user: me } = useAppContext();
  const { data: messages = [] } = useQuery({
    queryKey: queryKeys.messages(chat.id, group),
    queryFn: () => getMessages(chat.id, group),
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
        t("posts.comments.tooltip.locale"),
      ),
      time: message.createdAt.toLocaleTimeString(
        t("posts.comments.tooltip.locale"),
      ),
    });
  };

  return (
    <>
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          <Tooltip content={getTooltipText(message)}>
            <div className="group flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
              <div className="ml-1 flex grow gap-x-2 overflow-hidden">
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
  return (
    <Tooltip
      content={
        <I18nText translationKey="posts.comments.buttons.reply.tooltip" />
      }
    >
      <button onClick={onclick}>
        <FaReply
          className={cn(
            "transition-all group-hover:text-slate-600 group-hover:hover:text-slate-400 dark:group-hover:text-slate-400 dark:group-hover:hover:text-slate-600",
            {
              "text-slate-600 dark:text-slate-400": isActive,
              "text-transparent": !isActive,
            },
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
  const tooltipText = isActive ? (
    <I18nText translationKey="posts.comments.buttons.reduce.tooltip" />
  ) : (
    <I18nText translationKey="posts.comments.buttons.extend.tooltip" />
  );

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
            },
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
