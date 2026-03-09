import { timeDifference } from "@/utils/timeDifference";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";
import { createFullName } from "@/utils/createFullName";
import { IoIosChatbubbles } from "react-icons/io";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MdOutlineReport } from "react-icons/md";
import { AxiosError } from "axios";
import { PostWithRenderedContent } from "../schemas/post";
import { I18nText } from "@/components/shared/I18nText";
import { User } from "@/features/auth/schemas/user";
import Avatar from "@/components/shared/Avatar";
import { ActionButton } from "@/components/shared/navbar/NavbarSearch";
import Tooltip from "@/components/shared/Tooltip";
import FocusableSpan from "@/components/shared/FocusableSpan";
import { useToast } from "@/components/ui/use-toast";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { reportPost } from "../actions/reportPost";

export default function PostHeader({
  post,
}: {
  post: PostWithRenderedContent;
}) {
  const getTimeText = (): React.ReactNode => {
    const timeDiff = timeDifference(post.createdAt);

    if (timeDiff.days) {
      return (
        <I18nText
          translationKey="common.time.days"
          values={{ count: timeDiff.days }}
        />
      );
    } else if (timeDiff.hours) {
      return (
        <I18nText
          translationKey="common.time.hours"
          values={{ count: timeDiff.hours }}
        />
      );
    } else if (timeDiff.minutes > 5) {
      return (
        <I18nText
          translationKey="common.time.minutes"
          values={{ count: timeDiff.minutes }}
        />
      );
    } else {
      return <I18nText translationKey="common.time.now" />;
    }
  };

  const { author } = post;

  const handleCreateChat = async (userId: User["id"]) => {
    // TODO: make this function work
    // const chat = await ChatService.createPrivateChat(me!.id, userId);
    // queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
    //   if (oldChats?.find((c) => c.id === chat.id)) return oldChats;
    //   return oldChats ? [...oldChats, chat] : [chat];
    // });
    // navigate(ROUTES.CHAT_DETAIL.$buildPath({ params: { chatId: chat.id } }));
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

            <ActionButton
              onClick={() => handleCreateChat(post.author.id)}
              tooltipText={
                <I18nText translationKey="common.navbar.search.message.button.tooltip" />
              }
              Icon={
                <IoIosChatbubbles className="transition-all hover:scale-110" />
              }
            />
          </div>
          <p className="text-sm text-muted-foreground -mt-1">{getTimeText()}</p>
        </div>
      </div>
      <ReportPost post={post} />
    </div>
  );
}

function ReportPost({ post }: { post: PostWithRenderedContent }) {
  const { t } = useLanguageContext();
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
      <Tooltip
        content={
          <I18nText translationKey="posts.report.dialog.trigger.tooltip" />
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
            <I18nText translationKey="posts.report.dialog.title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <I18nText translationKey="posts.report.dialog.description" />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            <I18nText translationKey="posts.report.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <I18nText translationKey="posts.report.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
