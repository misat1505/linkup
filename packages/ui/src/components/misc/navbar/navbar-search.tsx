"use client";
import { Chat, Friendship, User } from "@packages/schemas";
import React, { useRef, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import {
  navigate,
  TRANSLATION_COMPONENT,
  useSearchUsersQuery,
  useUiPackageContext,
} from "../../../config";
import useClickOutside from "../../../hooks/use-click-outside";
import { cn } from "../../../lib/utils";
import { buildFileURL } from "../../../utils/build-file-url";
import { createFullName } from "../../../utils/create-full-name";
import { getInitials } from "../../../utils/get-initials";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Skeleton,
  toast,
} from "../../shadcn";
import { Avatar } from "../avatar";
import { FocusableSpan } from "../focusable-span";
import Tooltip from "../tooltip";

export type NavbarSearchProps = {
  user: User;
  createChatAction: (meId: User["id"], otherId: User["id"]) => Promise<Chat>;
  addFriendAction: (
    meId: User["id"],
    otherId: User["id"],
  ) => Promise<Friendship | null>;
  createChatCb?: (chat: Chat) => void;
  addFriendCb?: (friendship: Friendship) => void;
};

export function NavbarSearch({
  user: me,
  createChatCb,
  addFriendCb,
  addFriendAction,
  createChatAction,
}: NavbarSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const commandListRef = useRef<HTMLDivElement>(null);
  useClickOutside(commandListRef, () => setIsExpanded(false));
  const { isFetching, setText, users, debouncedText } = useSearchUsersQuery();
  const { t } = useUiPackageContext();

  return (
    <Command className="w-60 rounded-lg border bg-white shadow-md dark:bg-black">
      <Tooltip
        content={
          <TRANSLATION_COMPONENT translationKey="common.navbar.search.tooltip" />
        }
      >
        <CommandInput
          placeholder={t("common.navbar.search.placeholder")}
          data-testid="cy-nav-search-input"
          onInput={(e) => setText(e.currentTarget.value)}
          onFocus={() => setIsExpanded(true)}
        />
      </Tooltip>
      <CommandList
        ref={commandListRef}
        className={cn(
          "no-scrollbar absolute top-14 w-[238px] bg-white shadow-md",
          {
            hidden: !isExpanded,
          },
        )}
      >
        {isFetching ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <>
            <div
              className={cn({
                hidden: users.length > 0 || debouncedText.length === 0,
              })}
            >
              <CommandEmpty>
                <p className="text-muted-foreground">
                  <TRANSLATION_COMPONENT translationKey="common.navbar.search.no-users" />
                </p>
              </CommandEmpty>
            </div>
            <CommandGroup
              className={cn({ hidden: users.length === 0 })}
              forceMount={users.length > 0}
              heading={
                <TRANSLATION_COMPONENT translationKey="common.navbar.search.heading" />
              }
              data-testid="cy-nav-search-results"
            >
              {users.map((user) => (
                <SearchResultItem
                  key={user.id}
                  user={user}
                  setIsExpanded={setIsExpanded}
                  me={me}
                  addFriendCb={addFriendCb}
                  createChatCb={createChatCb}
                  addFriendAction={addFriendAction}
                  createChatAction={createChatAction}
                />
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}

type SearchResultItemProps = NavbarSearchProps & {
  me: User;
  user: User;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchResultItem({
  me,
  user,
  setIsExpanded,
  addFriendCb,
  createChatCb,
  addFriendAction,
  createChatAction,
}: SearchResultItemProps) {
  const { t } = useUiPackageContext();

  const handleCreateChat = async (userId: User["id"]) => {
    const chat = await createChatAction(me!.id, userId);
    setIsExpanded(false);
    createChatCb?.(chat);
    navigate(`/chats/${chat.id}`);
  };

  const handleAddFriend = async (userId: User["id"]) => {
    const friendship = await addFriendAction(me!.id, userId);
    setIsExpanded(false);

    if (!friendship)
      return toast({
        variant: "destructive",
        title: t(
          "common.navbar.search.friendships.toasts.already-exists.title",
        ),
        description: t(
          "common.navbar.search.friendships.toasts.already-exists.description",
          { fullName: createFullName(user) },
        ),
        action: (
          <Button onClick={() => navigate("/friends")}>
            <TRANSLATION_COMPONENT translationKey="common.navbar.search.friendships.toasts.already-exists.action" />
          </Button>
        ),
      });

    addFriendCb?.(friendship);

    toast({
      title: t(
        "common.navbar.search.friendships.toasts.successfully-created.title",
      ),
      description: t(
        "common.navbar.search.friendships.toasts.successfully-created.description",
        { fullName: createFullName(user) },
      ),
      action: (
        <Button onClick={() => navigate("/friends")}>
          <TRANSLATION_COMPONENT translationKey="common.navbar.search.friendships.toasts.successfully-created.action" />
        </Button>
      ),
    });
  };

  return (
    <CommandItem
      key={user.id}
      className="flex w-full items-center justify-between"
    >
      <div className="flex items-center">
        <Avatar
          src={buildFileURL(user.photoURL, { type: "avatar" })}
          alt={getInitials(user)}
          className="h-8 w-8 text-xs"
        />
        <span className="ml-4">{createFullName(user, 15)}</span>
      </div>
      <div className="flex gap-x-2">
        {me!.id !== user.id ? (
          <ActionButton
            onClick={() => handleAddFriend(user.id)}
            tooltipText={
              <TRANSLATION_COMPONENT translationKey="common.navbar.search.friendships.button.tooltip" />
            }
            Icon={<FaUserFriends className="transition-all hover:scale-125" />}
          />
        ) : (
          <div></div>
        )}
        <ActionButton
          onClick={() => handleCreateChat(user.id)}
          tooltipText={
            <TRANSLATION_COMPONENT translationKey="common.navbar.search.message.button.tooltip" />
          }
          Icon={<IoIosChatbubbles className="transition-all hover:scale-125" />}
        />
      </div>
    </CommandItem>
  );
}

type ActionButtonProps = {
  tooltipText: React.ReactNode;
  onClick: () => void;
  Icon: React.JSX.Element;
};

export function ActionButton({
  onClick,
  tooltipText,
  Icon,
}: ActionButtonProps) {
  return (
    <Tooltip content={tooltipText}>
      <span>
        <FocusableSpan fn={onClick}>{Icon}</FocusableSpan>
      </span>
    </Tooltip>
  );
}
