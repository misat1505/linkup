import React from "react";
import Avatar from "../common/Avatar";
import { Chat } from "../../models/Chat";
import { useAppContext } from "../../contexts/AppProvider";
import { API_URL } from "../../constants";
import {
  getChatName,
  getImageAlt,
  getImageURL,
  getLastActive
} from "../../utils/chatNavigationUtils";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import { getStatus, Status, timeDifference } from "../../utils/timeDifference";

export default function ChatHeader({ chat }: { chat: Chat }) {
  const { user: me } = useAppContext();
  const navigate = useNavigate();

  if (!me) throw new Error();

  const src = `${API_URL}/files/${getImageURL({ me, chat })!}`;
  const alt = getImageAlt({ me, chat });
  const chatName = getChatName({ me, chat });
  const lastActive = getLastActive({ me, chat });

  const createStatus = (): string => {
    const result = getStatus(timeDifference(lastActive));
    if (result.status === Status.ONLINE) return "Online";
    if (result.status === Status.OFFLINE) return "Offline";
    return result.text + " ago";
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-x-4">
        <Avatar src={src} alt={alt} lastActive={lastActive} />
        <div className="text-white">
          <h2 className="font-semibold">{chatName}</h2>
          <div className="text-sm">{createStatus()}</div>
        </div>
      </div>
      <button onClick={() => navigate(ROUTES.CHATS.path)}>
        <RxCross1 className="transition-all hover:scale-125" />
      </button>
    </div>
  );
}
