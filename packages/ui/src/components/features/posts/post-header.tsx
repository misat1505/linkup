"use client";

import { Chat, Post, User } from "@packages/schemas";
import { useState } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { MdOutlineReport } from "react-icons/md";
import {
  navigate,
  TRANSLATION_COMPONENT,
  useUiPackageContext,
} from "../../../config";
import { createFullName } from "../../../utils/create-full-name";
import { timeDifference } from "../../../utils/time-difference";
import { FocusableSpan } from "../../misc/focusable-span";
import { ActionButton } from "../../misc/navbar/navbar-search";
import { Tooltip } from "../../misc/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../shadcn/alert-dialog";
import { useToast } from "../../shadcn/use-toast";
import PostAuthorAvatar from "./post-author-avatar";

type PostHeaderProps = ReportPostProps & {
  me: User;
  createPrivateChatAction: (id1: User["id"], id2: User["id"]) => Promise<Chat>;
  createPrivateChatCb?: (chat: Chat) => void;
};

export function PostHeader({
  post,
  reportPost,
  createPrivateChatAction,
  createPrivateChatCb,
  me,
}: PostHeaderProps) {
  const { t } = useUiPackageContext();

  const getTimeText = (): string => {
    const timeDiff = timeDifference(post.createdAt);

    if (timeDiff.days) {
      return t("common.time.days", { count: String(timeDiff.days) });
    } else if (timeDiff.hours) {
      return t("common.time.hours", { count: String(timeDiff.hours) });
    } else if (timeDiff.minutes > 5) {
      return t("common.time.minutes", { count: String(timeDiff.minutes) });
    } else {
      return t("common.time.now");
    }
  };

  const { author } = post;
  const isMine = author.id === me!.id;

  const handleCreateChat = async (userId: User["id"]) => {
    const chat = await createPrivateChatAction(me!.id, userId);
    createPrivateChatCb?.(chat);
    navigate(`/chats/${chat.id}`);
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-x-4 py-4">
        <PostAuthorAvatar author={author} />
        <div>
          <div className="flex items-center gap-x-4">
            <h2 className="text-lg font-semibold">{createFullName(author)}</h2>
            {!isMine && (
              <ActionButton
                onClick={() => handleCreateChat(post.author.id)}
                tooltipText={t("common.navbar.search.message.button.tooltip")}
                Icon={
                  <IoIosChatbubbles className="transition-all hover:scale-110" />
                }
              />
            )}
          </div>
          <p className="text-sm text-muted-foreground -mt-1">{getTimeText()}</p>
        </div>
      </div>
      {!isMine && <ReportPost post={post} reportPost={reportPost} />}
    </div>
  );
}

type ReportPostProps = {
  post: Post;
  reportPost: (id: Post["id"]) => Promise<void>;
};

function ReportPost({ post, reportPost }: ReportPostProps) {
  const { t } = useUiPackageContext();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      await reportPost(post.id);
      toast({
        title: t("posts.report.toast.title"),
        description: t("posts.report.toast.description"),
      });
    } catch (e) {
      if ("response" in (e as any))
        toast({
          variant: "destructive",
          title: t("posts.report.fail-toast.title"),
          description: (e as any).response?.data.message,
        });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip
        content={
          <TRANSLATION_COMPONENT translationKey="posts.report.dialog.trigger.tooltip" />
        }
      >
        <span className="aspect-square text-red-500 transition-all hover:scale-110 hover:cursor-pointer mr-4">
          <FocusableSpan fn={() => setIsOpen(true)}>
            <MdOutlineReport size={20} />
          </FocusableSpan>
        </span>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TRANSLATION_COMPONENT translationKey="posts.report.dialog.title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <TRANSLATION_COMPONENT translationKey="posts.report.dialog.description" />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            <TRANSLATION_COMPONENT translationKey="posts.report.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <TRANSLATION_COMPONENT translationKey="posts.report.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
