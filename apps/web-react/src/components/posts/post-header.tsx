import { useAppContext } from "@/contexts/app-provider";
import { queryKeys } from "@/lib/query-keys";
import { ROUTES } from "@/lib/routes";
import { ChatService } from "@/services/chat.service";
import { PostService } from "@/services/post.service";
import { buildFileURL } from "@/utils/build-file-url";
import { createFullName } from "@/utils/create-full-name";
import { getInitials } from "@/utils/get-initials";
import { timeDifference } from "@/utils/time-difference";
import { Chat, Post, User } from "@packages/schemas";
import { AxiosError } from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosChatbubbles } from "react-icons/io";
import { MdOutlineReport } from "react-icons/md";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Avatar from "../common/avatar";
import FocusableSpan from "../common/focusable-span";
import { ActionButton } from "../common/navbar/navbar-search";
import Tooltip from "../common/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useToast } from "../ui/use-toast";

export default function PostHeader({ post }: { post: Post }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user: me } = useAppContext();
  const { t } = useTranslation();

  const getTimeText = (): string => {
    const timeDiff = timeDifference(post.createdAt);

    if (timeDiff.days) {
      return t("common.time.days", { count: timeDiff.days });
    } else if (timeDiff.hours) {
      return t("common.time.hours", { count: timeDiff.hours });
    } else if (timeDiff.minutes > 5) {
      return t("common.time.minutes", { count: timeDiff.minutes });
    } else {
      return t("common.time.now");
    }
  };

  const { author } = post;
  const isMine = author.id === me!.id;

  const handleCreateChat = async (userId: User["id"]) => {
    const chat = await ChatService.createPrivateChat(me!.id, userId);
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (oldChats?.find((c) => c.id === chat.id)) return oldChats;
      return oldChats ? [...oldChats, chat] : [chat];
    });
    navigate(ROUTES.CHAT_DETAIL.$buildPath({ params: { chatId: chat.id } }));
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-x-4 py-4">
        <Avatar
          className="border"
          src={buildFileURL(author.photoURL, { type: "avatar" })}
          alt={getInitials(author)}
        />
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
          <p className="text-sm text-muted-foreground mt-[-0.25rem]">
            {getTimeText()}
          </p>
        </div>
      </div>
      {!isMine && <ReportPost post={post} />}
    </div>
  );
}

function ReportPost({ post }: { post: Post }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      await PostService.reportPost(post.id);
      toast({
        title: t("posts.report.toast.title"),
        description: t("posts.report.toast.description"),
      });
    } catch (e) {
      if (e instanceof AxiosError)
        toast({
          variant: "destructive",
          title: t("posts.report.fail-toast.title"),
          description: e.response?.data.message,
        });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip content={t("posts.report.dialog.trigger.tooltip")}>
        <span className="aspect-square text-red-500 transition-all hover:scale-110 hover:cursor-pointer mr-4">
          <FocusableSpan fn={() => setIsOpen(true)}>
            <MdOutlineReport size={20} />
          </FocusableSpan>
        </span>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("posts.report.dialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("posts.report.dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {t("posts.report.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            {t("posts.report.dialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
