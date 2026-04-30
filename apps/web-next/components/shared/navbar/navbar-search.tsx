"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { searchUsers } from "@/features/auth/actions/search-users";
import { createPrivateChat } from "@/features/chats/actions/create-private-chats";
import { createFriendship } from "@/features/friends/actions/create-friendship";
import useClickOutside from "@/hooks/use-click-outside";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { buildFileURL } from "@/utils/build-file-url";
import { createFullName } from "@/utils/create-full-name";
import { getInitials } from "@/utils/get-initials";
import { User } from "@packages/schemas";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { useDebounce } from "use-debounce";
import Avatar from "../avatar";
import FocusableSpan from "../focusable-span";
import { I18nText } from "../i18n-text";
import Tooltip from "../tooltip";

export default function NavbarSearch() {
  const { user } = useAppContext();

  if (!user) return null;

  return <NavbarSearchContent />;
}

function NavbarSearchContent() {
  const { t } = useLanguageContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);
  const commandListRef = useRef<HTMLDivElement>(null);

  // @ts-expect-error it's good
  useClickOutside(commandListRef, () => setIsExpanded(false));

  const { data: users = [], isFetching } = useQuery({
    queryKey: queryKeys.searchUsers(debouncedText),
    queryFn: () => searchUsers(debouncedText),
    enabled: debouncedText.length > 0,
  });

  return (
    <Command className="w-60 rounded-lg border bg-white shadow-md dark:bg-black">
      <Tooltip
        content={<I18nText translationKey="common.navbar.search.tooltip" />}
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
                  <I18nText translationKey="common.navbar.search.no-users" />
                </p>
              </CommandEmpty>
            </div>
            <CommandGroup
              className={cn({ hidden: users.length === 0 })}
              forceMount={users.length > 0}
              heading={
                <I18nText translationKey="common.navbar.search.heading" />
              }
              data-testid="cy-nav-search-results"
            >
              {users.map((user) => (
                <SearchResultItem
                  key={user.id}
                  user={user}
                  setIsExpanded={setIsExpanded}
                />
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}

type SearchResultItemProps = {
  user: User;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

function SearchResultItem({ user, setIsExpanded }: SearchResultItemProps) {
  const { user: me } = useAppContext();
  const { t } = useLanguageContext();
  const router = useRouter();

  const handleCreateChat = async (userId: User["id"]) => {
    const chat = await createPrivateChat(me!.id, userId);

    router.push(`/chats/${chat.id}`);
  };

  const handleAddFriend = async (userId: User["id"]) => {
    const friendship = await createFriendship(me!.id, userId);
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
          <Button onClick={() => router.push("/friends")}>
            <I18nText translationKey="common.navbar.search.friendships.toasts.already-exists.action" />
          </Button>
        ),
      });

    toast({
      title: t(
        "common.navbar.search.friendships.toasts.successfully-created.title",
      ),
      description: t(
        "common.navbar.search.friendships.toasts.successfully-created.description",
        { fullName: createFullName(user) },
      ),
      action: (
        <Button onClick={() => router.push("/friends")}>
          <I18nText translationKey="common.navbar.search.friendships.toasts.successfully-created.action" />
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
              <I18nText translationKey="common.navbar.search.friendships.button.tooltip" />
            }
            Icon={<FaUserFriends className="transition-all hover:scale-125" />}
          />
        ) : (
          <div></div>
        )}
        <ActionButton
          onClick={() => handleCreateChat(user.id)}
          tooltipText={
            <I18nText translationKey="common.navbar.search.message.button.tooltip" />
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
  Icon: React.ReactNode;
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
