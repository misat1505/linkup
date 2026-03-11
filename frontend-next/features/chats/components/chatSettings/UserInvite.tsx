"use client";

import Avatar from "@/components/shared/Avatar";
import { I18nText } from "@/components/shared/I18nText";
import Tooltip from "@/components/shared/Tooltip";
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
import { User } from "@/features/auth/schemas/user";
import useUserSearch from "@/hooks/useUserSearch";
import { queryKeys } from "@/lib/queryKeys";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { buildFileURL } from "@/utils/buildFileURL";
import { createFullName } from "@/utils/createFullName";
import { getInitials } from "@/utils/getInitials";
import React, { useState } from "react";
import { HiUserAdd } from "react-icons/hi";
import { Chat } from "../../schemas/chat";
import { useParams } from "next/navigation";
import { addUserToChat } from "../../actions/addUserToChat";

export default function UserInvite({ chat }: { chat: Chat }) {
  const { t } = useLanguageContext();
  const [text, setText] = useState("");
  const { data } = useUserSearch(text);

  const filteredUsers = data?.filter(
    (user) => !chat.users!.some((u) => u.id === user.id),
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
  const classes = "mt-4 w-full text-center text-sm text-muted-foreground";

  if (users === undefined)
    return (
      <p className={classes}>
        <I18nText translationKey="chats.settings.group.invite.empty" />
      </p>
    );

  if (users.length === 0)
    return (
      <p className={classes}>
        <I18nText translationKey="chats.settings.group.invite.no-result" />
      </p>
    );

  return (
    <div className="no-scrollbar max-h-85 overflow-auto">
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
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    await addUserToChat(id as Chat["id"], user.id);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        <span>
          <Tooltip
            content={
              <I18nText
                translationKey="chats.settings.group.invite.trigger.tooltip"
                values={{
                  name: createFullName(user),
                }}
              />
            }
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
            <I18nText
              translationKey="chats.settings.group.invite.dialog.title"
              values={{
                name: createFullName(user),
              }}
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <I18nText
              translationKey="chats.settings.group.invite.dialog.description"
              values={{
                name: createFullName(user),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            <I18nText translationKey="chats.settings.group.invite.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <I18nText translationKey="chats.settings.group.invite.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
