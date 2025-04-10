import { Post } from "@/types/Post";
import { timeDifference } from "@/utils/timeDifference";
import Avatar from "../common/Avatar";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";
import { createFullName } from "@/utils/createFullName";
import { useTranslation } from "react-i18next";
import { IoIosChatbubbles } from "react-icons/io";
import { ActionButton } from "../common/navbar/NavbarSearch";
import { ChatService } from "@/services/Chat.service";
import { User } from "@/types/User";
import { useAppContext } from "@/contexts/AppProvider";
import { Chat } from "@/types/Chat";
import { queryKeys } from "@/lib/queryKeys";
import { ROUTES } from "@/lib/routes";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

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
            <ActionButton
              onClick={() => handleCreateChat(post.author.id)}
              tooltipText={t("common.navbar.search.message.button.tooltip")}
              Icon={
                <IoIosChatbubbles className="transition-all hover:scale-110" />
              }
            />
          </div>
          <p className="text-sm text-muted-foreground mt-[-0.25rem]">
            {getTimeText()}
          </p>
        </div>
      </div>
      <div>hsdusau</div>
    </div>
  );
}
