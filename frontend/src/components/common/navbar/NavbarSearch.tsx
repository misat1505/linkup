import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useClickOutside from "@/hooks/useClickOutside";
import { queryKeys } from "@/lib/queryKeys";
import { UserService } from "@/services/User.service";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDebounce } from "use-debounce";
import Tooltip from "../Tooltip";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/User";
import { useAppContext } from "@/contexts/AppProvider";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ChatService } from "@/services/Chat.service";
import { Chat } from "@/types/Chat";
import { ROUTES } from "@/lib/routes";
import { FriendService } from "@/services/Friend.service";
import { createFullName } from "@/utils/createFullName";
import { Button } from "@/components/ui/button";
import { Friendship } from "@/types/Friendship";
import Avatar from "../Avatar";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";
import { FaUserFriends } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import FocusableSpan from "../FocusableSpan";
import { useTranslation } from "react-i18next";

export default function NavbarSearch() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);
  const commandListRef = useRef<HTMLDivElement>(null);
  useClickOutside(commandListRef, () => setIsExpanded(false));

  const { data: users = [], isFetching } = useQuery({
    queryKey: queryKeys.searchUsers(debouncedText),
    queryFn: () => UserService.search(debouncedText),
    enabled: debouncedText.length > 0,
  });

  return (
    <Command className="w-60 rounded-lg border bg-white shadow-md dark:bg-black">
      <Tooltip content="Search for users">
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
          }
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
                  {t("common.navbar.search.no-users")}
                </p>
              </CommandEmpty>
            </div>
            <CommandGroup
              className={cn({ hidden: users.length === 0 })}
              forceMount={users.length > 0}
              heading="Suggestions"
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
  const { t } = useTranslation();
  const { user: me } = useAppContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateChat = async (userId: User["id"]) => {
    const chat = await ChatService.createPrivateChat(me!.id, userId);
    setIsExpanded(false);
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (oldChats?.find((c) => c.id === chat.id)) return oldChats;
      return oldChats ? [...oldChats, chat] : [chat];
    });
    navigate(ROUTES.CHAT_DETAIL.$buildPath({ params: { chatId: chat.id } }));
  };

  const handleAddFriend = async (userId: User["id"]) => {
    const friendship = await FriendService.createFriendship(me!.id, userId);
    setIsExpanded(false);

    if (!friendship)
      return toast({
        variant: "destructive",
        title: t(
          "common.navbar.search.friendships.toasts.already-exists.title"
        ),
        description: t(
          "common.navbar.search.friendships.toasts.already-exists.description",
          { fullName: createFullName(user) }
        ),
        action: (
          <Button onClick={() => navigate(ROUTES.FRIENDS.$path())}>
            {t("common.navbar.search.friendships.toasts.already-exists.action")}
          </Button>
        ),
      });

    queryClient.setQueryData<Friendship[]>(
      queryKeys.friends(),
      (oldFriends) => {
        if (
          oldFriends?.find(
            (f) =>
              f.requester.id === friendship.requester.id &&
              f.acceptor.id === friendship.acceptor.id
          )
        )
          return oldFriends;
        return oldFriends ? [...oldFriends, friendship] : [friendship];
      }
    );

    toast({
      title: t(
        "common.navbar.search.friendships.toasts.successfully-created.title"
      ),
      description: t(
        "common.navbar.search.friendships.toasts.successfully-created.description",
        { fullName: createFullName(user) }
      ),
      action: (
        <Button onClick={() => navigate(ROUTES.FRIENDS.$path())}>
          {t(
            "common.navbar.search.friendships.toasts.successfully-created.action"
          )}
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
            tooltipText={t("common.navbar.search.friendships.button.tooltip")}
            Icon={<FaUserFriends className="transition-all hover:scale-125" />}
          />
        ) : (
          <div></div>
        )}
        <ActionButton
          onClick={() => handleCreateChat(user.id)}
          tooltipText="Send Message"
          Icon={<IoIosChatbubbles className="transition-all hover:scale-125" />}
        />
      </div>
    </CommandItem>
  );
}

type ActionButtonProps = {
  tooltipText: string;
  onClick: () => void;
  Icon: JSX.Element;
};

function ActionButton({ onClick, tooltipText, Icon }: ActionButtonProps) {
  return (
    <Tooltip content={tooltipText}>
      <span>
        <FocusableSpan fn={onClick}>{Icon}</FocusableSpan>
      </span>
    </Tooltip>
  );
}
