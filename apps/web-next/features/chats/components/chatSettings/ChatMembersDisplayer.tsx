"use client";

import Avatar from "@/components/shared/Avatar";
import FocusableSpan from "@/components/shared/FocusableSpan";
import { I18nText } from "@/components/shared/I18nText";
import Tooltip from "@/components/shared/Tooltip";
import { useAppContext } from "@/providers/AppProvider";
import { buildFileURL } from "@/utils/buildFileURL";
import { createFullName } from "@/utils/createFullName";
import { getInitials } from "@/utils/getInitials";
import { Chat, UserInChat } from "@packages/schemas";
import { useRouter } from "next/navigation";
import { IoIosChatbubbles } from "react-icons/io";
import { createPrivateChat } from "../../actions/createPrivateChats";
import AliasUpdateModal from "./AliasUpdateModal";

type ChatMembersDisplayerProps = {
  chat: Chat;
};

export default function ChatMembersDisplayer({
  chat,
}: ChatMembersDisplayerProps) {
  const users = chat.users!;

  return (
    <div className="my-4 w-full">
      {users.map((user) => (
        <ChatMemberDisplayItem key={user.id} user={user} chat={chat} />
      ))}
    </div>
  );
}

function ChatMemberDisplayItem({
  user,
  chat,
}: {
  user: UserInChat;
  chat: Chat;
}) {
  return (
    <div className="mb-2 flex w-full items-center justify-between gap-x-2  bg-slate-100 p-1 dark:bg-slate-900">
      <div className="flex items-center gap-x-2">
        <Avatar
          src={buildFileURL(user.photoURL, { type: "avatar" })}
          alt={getInitials(user)}
          className="h-8 w-8 text-xs"
        />
        <div>
          <p className="font-semibold">{createFullName(user)}</p>
          <p className="text-xs">
            {user.alias || (
              <I18nText translationKey="chats.settings.update-alias-dialog.no-alias" />
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        {chat.type === "GROUP" && <CreateMessageButton user={user} />}
        <AliasUpdateModal user={user} />
      </div>
    </div>
  );
}

function CreateMessageButton({ user }: { user: UserInChat }) {
  const { user: me } = useAppContext();
  const router = useRouter();

  const handleClick = async () => {
    const chat = await createPrivateChat(me!.id, user.id);

    router.push(`/chats/${chat.id}`);
  };

  return (
    <Tooltip
      content={
        <I18nText translationKey="chats.settings.users.actions.send-message.tooltip" />
      }
    >
      <span className="aspect-square rounded-full bg-slate-200 p-1 transition-colors hover:cursor-pointer hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
        <FocusableSpan fn={handleClick}>
          <IoIosChatbubbles size={20} />
        </FocusableSpan>
      </span>
    </Tooltip>
  );
}
