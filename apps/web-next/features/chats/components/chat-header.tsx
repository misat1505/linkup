import { buildFileURL, Filter } from "@/utils/build-file-url";
import { FaUserGroup } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { getMeCached } from "@/features/auth/actions/get-me";
import { ChatUtils } from "../utils/chat-utils";
import ChatHeaderStatus from "./chat-header-status";
import { I18nText } from "@/components/shared/i18n-text";
import Link from "next/link";
import { Chat } from "@packages/schemas";
import Avatar from "@/components/shared/avatar";
import Tooltip from "@/components/shared/tooltip";
import ChatSettingsDialog from "./chat-settings/chat-settings-dialog";
import ChatLeaveDialog from "./chat-leave-dialog";

export default async function ChatHeader({ chat }: { chat: Chat }) {
  const me = await getMeCached();

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

  const buildFilter = (): Filter => {
    if (chat.type === "PRIVATE") return { type: "avatar" };
    return { type: "chat-photo", id: chat.id };
  };

  return (
    <div className="flex items-center justify-between gap-x-4 p-4">
      <div className="flex grow items-center gap-x-4 overflow-hidden">
        <Avatar
          src={buildFileURL(src, buildFilter())}
          alt={alt}
          lastActive={lastActive}
        />
        <div className="overflow-hidden text-nowrap text-white">
          <h2 className="font-semibold">{chatName}</h2>
          <div className="text-sm">
            <ChatHeaderStatus lastActive={lastActive} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        {chat.type === "GROUP" && <ChatLeaveDialog />}
        <ChatSettingsDialog chat={chat} />
        <Tooltip content={<I18nText translationKey="chats.close.tooltip" />}>
          <span className="transition-all hover:scale-125">
            <Link href="/chats">
              <RxCross1 size={16} />
            </Link>
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
