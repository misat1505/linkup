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
import { User } from "../../../models/User";
import Image from "../Image";
import { FaUserFriends } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../../ui/tooltip";
import { useDebounce } from "use-debounce";
import { Skeleton } from "../../ui/skeleton";
import { useQuery } from "react-query";
import { searchUsers } from "../../../api/userAPI";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../lib/routes";
import { createChatBetweenUsers } from "../../../api/chatAPI";
import { useAppContext } from "../../../contexts/AppProvider";
import useClickOutside from "../../../hooks/useClickOutside";

export default function NavbarSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);
  const commandListRef = useRef<HTMLDivElement>(null);
  useClickOutside(commandListRef, () => setIsExpanded(false));

  const { data: users = [], isFetching } = useQuery({
    queryKey: ["search-users", { debouncedText }],
    queryFn: () => searchUsers(debouncedText),
    enabled: debouncedText.length > 0
  });

  return (
    <Command className="w-60 rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search on Link Up..."
        onInput={(e) => setText(e.currentTarget.value)}
        onFocus={() => setIsExpanded(true)}
      />
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
  const navigate = useNavigate();

  const createFullName = (
    firstName: User["firstName"],
    lastName: User["lastName"],
    maxLength = 15
  ): string => {
    const fullName = `${firstName} ${lastName}`;
    if (firstName.length + lastName.length > maxLength) {
      return `${fullName.substring(0, maxLength)}...`;
    }
    return fullName;
  };

  const handleCreateChat = async (userId: User["id"]) => {
    const chat = await createChatBetweenUsers(me!.id, userId);
    setIsExpanded(false);
    navigate(ROUTES.CHAT_DETAIL.buildPath({ chatId: chat.id }));
  };

  return (
    <CommandItem
      key={user.id}
      className="flex w-full items-center justify-between"
    >
      <div className="flex items-center">
        <Image
          src={user.photoURL!}
          className={{
            common: "h-8 w-8 rounded-full object-cover",
            error: "bg-white text-xs font-semibold"
          }}
          errorContent={`${user.firstName.toUpperCase()[0]}${user.lastName.toUpperCase()[0]}`}
        />
        <span className="ml-4">
          {createFullName(user.firstName, user.lastName)}
        </span>
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onClick}>{Icon}</button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
