import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { IoIosChatbubbles } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "@/contexts/ChatProvider";
import { Chat, UserInChat } from "@/types/Chat";
import Avatar from "@/components/common/Avatar";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";
import { createFullName } from "@/utils/createFullName";
import { useAppContext } from "@/contexts/AppProvider";
import { ChatService } from "@/services/Chat.service";
import { queryKeys } from "@/lib/queryKeys";
import { ROUTES } from "@/lib/routes";
import Tooltip from "@/components/common/Tooltip";
import FocusableSpan from "@/components/common/FocusableSpan";
import { useQueryClient } from "react-query";
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
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export default function ChatMembersDisplayer() {
  const { chat } = useChatContext();
  if (!chat) throw new Error();

  const users = chat.users!;

  return (
    <div className="my-4 w-full">
      {users.map((user) => (
        <ChatMemberDisplayItem key={user.id} user={user} />
      ))}
    </div>
  );
}

function ChatMemberDisplayItem({ user }: { user: UserInChat }) {
  const { t } = useTranslation();
  const { chat } = useChatContext();

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
            {user.alias || t("chats.settings.update-alias-dialog.no-alias")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        {chat?.type === "GROUP" && <CreateMessageButton user={user} />}
        <AliasUpdateModal user={user} />
      </div>
    </div>
  );
}

function CreateMessageButton({ user }: { user: UserInChat }) {
  const { t } = useTranslation();
  const { user: me } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleClick = async () => {
    const chat = await ChatService.createPrivateChat(me!.id, user.id);
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (oldChats?.find((c) => c.id === chat.id)) return oldChats;
      return oldChats ? [...oldChats, chat] : [chat];
    });
    navigate(ROUTES.CHAT_DETAIL.$buildPath({ params: { chatId: chat.id } }));
  };

  return (
    <Tooltip content={t("chats.settings.users.actions.send-message.tooltip")}>
      <span className="aspect-square rounded-full bg-slate-200 p-1 transition-colors hover:cursor-pointer hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
        <FocusableSpan fn={handleClick}>
          <IoIosChatbubbles size={20} />
        </FocusableSpan>
      </span>
    </Tooltip>
  );
}

function AliasUpdateModal({ user }: { user: UserInChat }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { chatId } = useChatContext();
  const [text, setText] = useState(user.alias);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const inputValue = e.target.value;

    setText(inputValue === "" ? null : inputValue);
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();

      await ChatService.updateAlias(chatId, user.id, text);

      queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
        if (!oldChats) return [];

        const chat = oldChats.find((chat) => chat.id === chatId)!;
        const cacheUser = chat.users?.find((u) => u.id === user.id)!;
        cacheUser.alias = text;

        return [...oldChats];
      });
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip content={t("chats.settings.users.actions.update-alias.tooltip")}>
        <span className="aspect-square rounded-full bg-slate-200 p-1 transition-colors hover:cursor-pointer hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
          <FocusableSpan fn={() => setIsOpen(true)}>
            <MdEdit size={20} />
          </FocusableSpan>
        </span>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("chats.settings.update-alias-dialog.title", {
              name: createFullName(user),
            })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("chats.settings.update-alias-dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <Input
            value={text || ""}
            placeholder={t(
              "chats.settings.update-alias-dialog.input.placeholder"
            )}
            onChange={handleChange}
            className="text-sm"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {t("chats.settings.update-alias-dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            {t("chats.settings.update-alias-dialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
