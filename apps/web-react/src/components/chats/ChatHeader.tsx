import { useAppContext } from "@/contexts/AppProvider";
import { useChatPageContext } from "@/contexts/ChatPageProvider";
import { Chat } from "@/types/Chat";
import { buildFileURL, Filter } from "@/utils/buildFileURL";
import { ChatUtils } from "@/utils/chatUtils";
import { getStatus, Status, timeDifference } from "@/utils/timeDifference";
import { FaUserGroup } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import ChatLeaveDialog from "./ChatLeaveDialog";
import ChatSettingsDialog from "./chatSettings/ChatSettingsDialog";
import Tooltip from "../common/Tooltip";
import FocusableSpan from "../common/FocusableSpan";
import { RxCross1 } from "react-icons/rx";
import { ROUTES } from "@/lib/routes";
import { useTranslation } from "react-i18next";

export default function ChatHeader({ chatId }: { chatId: Chat["id"] }) {
  const { t } = useTranslation();
  const { chats } = useChatPageContext();
  const { user: me } = useAppContext();
  const navigate = useNavigate();

  const chat = chats?.find((c) => c.id === chatId);

  if (!me || !chat) throw new Error();

  const utils = new ChatUtils(chat, me);

  const src = utils.getImageURL()!;
  const alt =
    chat.type === "PRIVATE" ? (
      utils.getImageAlt()
    ) : (
      <FaUserGroup className="object-fit h-full w-full pt-4" />
    );
  const chatName = utils.getChatName();
  const lastActive = utils.getLastActive();

  const createStatus = (): string => {
    const result = getStatus(timeDifference(lastActive), t);
    if (result.status === Status.ONLINE) return t("chats.user-activity.online");
    if (result.status === Status.OFFLINE)
      return t("chats.user-activity.offline");
    return result.text + " " + t("common.time.ago");
  };

  const buildFilter = (): Filter => {
    if (chat.type === "PRIVATE") return { type: "avatar" };
    return { type: "chat-photo", id: chat.id };
  };

  return (
    <div className="flex items-center justify-between gap-x-4 p-4">
      <div className="flex flex-grow items-center gap-x-4 overflow-hidden">
        <Avatar
          src={buildFileURL(src, buildFilter())}
          alt={alt}
          lastActive={lastActive}
        />
        <div className="overflow-hidden text-nowrap text-white">
          <h2 className="font-semibold">{chatName}</h2>
          <div className="text-sm">{createStatus()}</div>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        {chat.type === "GROUP" && <ChatLeaveDialog />}
        <ChatSettingsDialog />
        <Tooltip content={t("chats.close.tooltip")}>
          <span className="transition-all hover:scale-125">
            <FocusableSpan fn={() => navigate(ROUTES.CHATS.$path())}>
              <RxCross1 size={16} />
            </FocusableSpan>
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
