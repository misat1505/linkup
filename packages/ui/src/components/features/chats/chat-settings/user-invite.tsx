"use client";

import { Chat, User, UserInChat } from "@packages/schemas";
import React, { useState } from "react";
import { HiUserAdd } from "react-icons/hi";
import { TRANSLATION_COMPONENT } from "../../../../config";
import { buildFileURL } from "../../../../utils/build-file-url";
import { createFullName } from "../../../../utils/create-full-name";
import { getInitials } from "../../../../utils/get-initials";
import { Avatar } from "../../../misc/avatar";
import { Tooltip } from "../../../misc/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../shadcn/alert-dialog";

type UserSearchDisplayerProps = Omit<UserAddDialogProps, "user"> & {
  users: User[] | undefined;
};

export function UserSearchDisplayer(props: UserSearchDisplayerProps) {
  const { users } = props;

  const classes = "mt-4 w-full text-center text-sm text-muted-foreground";

  if (users === undefined)
    return (
      <p className={classes}>
        <TRANSLATION_COMPONENT translationKey="chats.settings.group.invite.empty" />
      </p>
    );

  if (users.length === 0)
    return (
      <p className={classes}>
        <TRANSLATION_COMPONENT translationKey="chats.settings.group.invite.no-result" />
      </p>
    );

  return (
    <div className="no-scrollbar max-h-85 overflow-auto">
      {users.map((user) => (
        <UserDisplay user={user} {...props} key={user.id} />
      ))}
    </div>
  );
}

function UserDisplay(props: UserAddDialogProps) {
  const { user } = props;

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
      <UserAddDialog {...props} />
    </div>
  );
}

type UserAddDialogProps = {
  user: User;
  chatId: Chat["id"];
  addUserToChatAction: (
    chatId: Chat["id"],
    userId: User["id"],
  ) => Promise<UserInChat>;
  addUserToChatCb?: (user: UserInChat) => void;
};

function UserAddDialog({
  user,
  chatId,
  addUserToChatAction,
  addUserToChatCb,
}: UserAddDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const newUser = await addUserToChatAction(chatId, user.id);
    addUserToChatCb?.(newUser);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        <span>
          <Tooltip
            content={
              <TRANSLATION_COMPONENT
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
            <TRANSLATION_COMPONENT
              translationKey="chats.settings.group.invite.dialog.title"
              values={{
                name: createFullName(user),
              }}
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <TRANSLATION_COMPONENT
              translationKey="chats.settings.group.invite.dialog.description"
              values={{
                name: createFullName(user),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            <TRANSLATION_COMPONENT translationKey="chats.settings.group.invite.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <TRANSLATION_COMPONENT translationKey="chats.settings.group.invite.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
