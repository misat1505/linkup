import { Message, User } from "@packages/schemas";
import { PropsWithChildren } from "react";
import { FaArrowDown, FaReply } from "react-icons/fa";
import { TRANSLATION_COMPONENT, useUiPackageContext } from "../../../config";
import { cn } from "../../../lib/utils";
import { createFullName } from "../../../utils/create-full-name";
import { Tooltip } from "../../misc/tooltip";
import { Button } from "../../shadcn/button";
import { Comment } from "./comment";

type PostCommentSectionLayoutProps = PropsWithChildren & {
  message: Message;
  me: User;
  level: number;
};

export function PostCommentSectionLayout({
  message,
  me,
  level,
  children,
}: PostCommentSectionLayoutProps) {
  const { t } = useUiPackageContext();

  const getTooltipText = (message: Message) => {
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
    <Tooltip content={getTooltipText(message)}>
      <div className="group flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
        <div className="ml-1 flex grow gap-x-2 overflow-hidden">
          <LevelIndicator level={level} />
          <Comment message={message} />
        </div>
        <div className="flex items-center gap-x-2">{children}</div>
      </div>
    </Tooltip>
  );
}

type CommentSectionOpenButtonProps = {
  isCommentSectionOpen: boolean;
  toggleIsCommentSectionOpen: () => void;
};

export function CommentSectionOpenButton({
  isCommentSectionOpen,
  toggleIsCommentSectionOpen,
}: CommentSectionOpenButtonProps) {
  const tooltipText = isCommentSectionOpen ? (
    <TRANSLATION_COMPONENT translationKey="posts.comments.section.close" />
  ) : (
    <TRANSLATION_COMPONENT translationKey="posts.comments.section.open" />
  );

  return (
    <Tooltip content={tooltipText}>
      <Button
        variant="ghost"
        className={cn("w-full mt-4", { "my-4": isCommentSectionOpen })}
        onClick={toggleIsCommentSectionOpen}
      >
        <FaArrowDown className={cn({ "rotate-180": isCommentSectionOpen })} />
      </Button>
    </Tooltip>
  );
}

export function ResponseSetButton({
  isActive,
  onclick,
}: {
  isActive: boolean;
  onclick: () => void;
}) {
  return (
    <Tooltip
      content={
        <TRANSLATION_COMPONENT translationKey="posts.comments.buttons.reply.tooltip" />
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

export function ToggleSubsectionOpenButton({
  isActive,
  onclick,
}: {
  isActive: boolean;
  onclick: () => void;
}) {
  const tooltipText = isActive ? (
    <TRANSLATION_COMPONENT translationKey="posts.comments.buttons.reduce.tooltip" />
  ) : (
    <TRANSLATION_COMPONENT translationKey="posts.comments.buttons.extend.tooltip" />
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

export function LevelIndicator({ level }: { level: number }) {
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
