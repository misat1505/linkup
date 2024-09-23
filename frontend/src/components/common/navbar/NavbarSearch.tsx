import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "../../ui/command";
import { useState, useRef } from "react";
import { cn } from "../../../lib/utils";
import { User } from "../../../types/User";
import { FaUserFriends } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { useDebounce } from "use-debounce";
import { Skeleton } from "../../ui/skeleton";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../lib/routes";
import { useAppContext } from "../../../contexts/AppProvider";
import useClickOutside from "../../../hooks/useClickOutside";
import Avatar from "../Avatar";
import { getInitials } from "../../../utils/getInitials";
import { createFullName } from "../../../utils/createFullName";
import { queryKeys } from "../../../lib/queryKeys";
import { Chat } from "../../../types/Chat";
import { UserService } from "../../../services/User.service";
import { ChatService } from "../../../services/Chat.service";
import Tooltip from "../Tooltip";
import { buildFileURL } from "../../../utils/buildFileURL";

export default function NavbarSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);
  const commandListRef = useRef<HTMLDivElement>(null);
  useClickOutside(commandListRef, () => setIsExpanded(false));

  const { data: users = [], isFetching } = useQuery({
    queryKey: queryKeys.searchUsers(debouncedText),
    queryFn: () => UserService.search(debouncedText),
    enabled: debouncedText.length > 0
  });
  console.log(users);

  return (
    <Command className="w-60 rounded-lg border bg-white shadow-md dark:bg-black">
      <Tooltip content="Search for users">
        <CommandInput
          placeholder="Search on Link Up..."
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
            hidden: !isExpanded
          }
        )}
      >
        {isFetching ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <>
            <div
              className={cn({
                hidden: users.length > 0 || debouncedText.length === 0
              })}
            >
              <CommandEmpty>
                <p className="text-muted-foreground">No users found.</p>
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
  const { user: me } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleCreateChat = async (userId: User["id"]) => {
    const chat = await ChatService.createPrivateChat(me!.id, userId);
    setIsExpanded(false);
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (oldChats?.find((c) => c.id === chat.id)) return oldChats;
      return oldChats ? [...oldChats, chat] : [chat];
    });
    navigate(ROUTES.CHAT_DETAIL.buildPath({ chatId: chat.id }));
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
        <ActionButton
          onClick={() => {}}
          tooltipText="Add friend"
          Icon={<FaUserFriends className="transition-all hover:scale-125" />}
        />
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
      <button onClick={onClick}>{Icon}</button>
    </Tooltip>
  );
}
