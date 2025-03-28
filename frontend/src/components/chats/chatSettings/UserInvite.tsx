import Avatar from "@/components/common/Avatar";
import Tooltip from "@/components/common/Tooltip";
import {
  AlertDialogAction,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/contexts/ChatProvider";
import useUserSearch from "@/hooks/useUserSearch";
import { queryKeys } from "@/lib/queryKeys";
import { ChatService } from "@/services/Chat.service";
import { Chat } from "@/types/Chat";
import { User } from "@/types/User";
import { buildFileURL } from "@/utils/buildFileURL";
import { createFullName } from "@/utils/createFullName";
import { getInitials } from "@/utils/getInitials";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiUserAdd } from "react-icons/hi";
import { useQueryClient } from "react-query";

export default function UserInvite() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const { data } = useUserSearch(text);
  const { chat } = useChatContext();

  const filteredUsers = data?.filter(
    (user) => !chat!.users!.some((u) => u.id === user.id)
  );

  return (
    <div>
      <Input
        placeholder={t("chats.settings.group.invite.search.placeholder")}
        className="my-2"
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <UserSearchDisplayer users={filteredUsers} />
    </div>
  );
}

function UserSearchDisplayer({ users }: { users: User[] | undefined }) {
  const { t } = useTranslation();
  const classes = "mt-4 w-full text-center text-sm text-muted-foreground";

  if (users === undefined)
    return <p className={classes}>{t("chats.settings.group.invite.empty")}</p>;

  if (users.length === 0)
    return (
      <p className={classes}>{t("chats.settings.group.invite.no-result")}</p>
    );

  return (
    <div className="no-scrollbar max-h-[340px] overflow-auto">
      {users.map((user) => (
        <UserDisplay user={user} key={user.id} />
      ))}
    </div>
  );
}

function UserDisplay({ user }: { user: User }) {
  return (
    <div className="my-1 flex w-full items-center justify-between gap-x-2 rounded-md bg-slate-100 p-2 transition-all dark:bg-slate-900">
      <div className="flex items-center gap-x-2">
        <Avatar
          src={buildFileURL(user.photoURL, { type: "avatar" })}
          alt={getInitials(user)}
          className="h-8 w-8 text-xs"
        />
        <p className="font-semibold">{createFullName(user)}</p>
      </div>
      <UserAddDialog user={user} />
    </div>
  );
}

function UserAddDialog({ user }: { user: User }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { chatId } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const newUser = await ChatService.addUserToChat(chatId, user.id);

    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (!oldChats) return [];

      const chat = oldChats.find((c) => c.id === chatId)!;
      chat.users?.push(newUser);
      return [...oldChats];
    });
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        <span>
          <Tooltip
            content={t("chats.settings.group.invite.trigger.tooltip", {
              name: createFullName(user),
            })}
          >
            <div className="mr-1 rounded-full bg-slate-200 p-1 transition-colors hover:cursor-pointer hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
              <HiUserAdd size={20} />
            </div>
          </Tooltip>
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("chats.settings.group.invite.dialog.title", {
              name: createFullName(user),
            })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("chats.settings.group.invite.dialog.description", {
              name: createFullName(user),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {t("chats.settings.group.invite.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            {t("chats.settings.group.invite.dialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
