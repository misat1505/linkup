"use client";

import { Chat, User, UserInChat } from "@packages/schemas";
import { IoIosChatbubbles } from "react-icons/io";
import { navigate, TRANSLATION_COMPONENT } from "../../../../config";
import { buildFileURL } from "../../../../utils/build-file-url";
import { createFullName } from "../../../../utils/create-full-name";
import { getInitials } from "../../../../utils/get-initials";
import { Avatar } from "../../../misc/avatar";
import { FocusableSpan } from "../../../misc/focusable-span";
import { Tooltip } from "../../../misc/tooltip";

type ChatMembersDisplayItemProps = CreateMessageButtonProps & {
  chat: Chat;
  slots: {
    aliasUpdateModal: React.ReactNode;
  };
};

export function ChatMembersDisplayItem({
  chat,
  slots,
  user,
  ...rest
}: ChatMembersDisplayItemProps) {
  return (
    <div
      key={user.id}
      className="mb-2 flex w-full items-center justify-between gap-x-2  bg-slate-100 p-1 dark:bg-slate-900"
    >
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
              <TRANSLATION_COMPONENT translationKey="chats.settings.update-alias-dialog.no-alias" />
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        {chat.type === "GROUP" && <CreateMessageButton user={user} {...rest} />}
        {slots.aliasUpdateModal}
      </div>
    </div>
  );
}

type CreateMessageButtonProps = {
  user: UserInChat;
  me: User;
  createPrivateChatAction: (id1: User["id"], id2: User["id"]) => Promise<Chat>;
  createPrivateChatCb?: (chat: Chat) => void;
};

function CreateMessageButton({
  user,
  me,
  createPrivateChatAction,
  createPrivateChatCb,
}: CreateMessageButtonProps) {
  const handleClick = async () => {
    const chat = await createPrivateChatAction(me!.id, user.id);
    createPrivateChatCb?.(chat);

    navigate(`/chats/${chat.id}`);
  };

  return (
    <Tooltip
      content={
        <TRANSLATION_COMPONENT translationKey="chats.settings.users.actions.send-message.tooltip" />
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
