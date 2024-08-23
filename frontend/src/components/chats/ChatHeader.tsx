import React from "react";
import Avatar from "../common/Avatar";
import { Chat } from "../../models/Chat";
import { useAppContext } from "../../contexts/AppProvider";
import { ChatUtils } from "../../utils/chatUtils";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import { getStatus, Status, timeDifference } from "../../utils/timeDifference";
import { useChatPageContext } from "../../contexts/ChatPageProvider";
import { FaUserGroup } from "react-icons/fa6";
import Tooltip from "../common/Tooltip";

export default function ChatHeader({ chatId }: { chatId: Chat["id"] }) {
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
    const result = getStatus(timeDifference(lastActive));
    if (result.status === Status.ONLINE) return "Online";
    if (result.status === Status.OFFLINE) return "Offline";
    return result.text + " ago";
  };

  return (
    <div className="flex items-center justify-between gap-x-4 p-4">
      <div className="flex flex-grow items-center gap-x-4 overflow-hidden">
        <Avatar src={src} alt={alt} lastActive={lastActive} />
        <div className="overflow-hidden text-nowrap text-white">
          <h2 className="font-semibold">{chatName}</h2>
          <div className="text-sm">{createStatus()}</div>
        </div>
      </div>
      <button onClick={() => navigate(ROUTES.CHATS.path)}>
        <Tooltip content="Close chat">
          <span>
            <RxCross1 className="transition-all hover:scale-125" />
          </span>
        </Tooltip>
      </button>
    </div>
  );
}
