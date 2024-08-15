import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "../../ui/command";
import { useState, useEffect, useRef } from "react";
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

export default function NavbarSearch() {
  const { user } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);
  const navigate = useNavigate();
  const commandListRef = useRef<HTMLDivElement>(null);

  const { data: users = [], isFetching } = useQuery({
    queryKey: ["search-users", { debouncedText }],
    queryFn: () => searchUsers(debouncedText),
    enabled: debouncedText.length > 0
  });

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

  const handleCreateChat = async (userId: string) => {
    const chat = await createChatBetweenUsers(user!.id, userId);
    setIsExpanded(false);
    navigate(ROUTES.CHAT_DETAIL.buildPath({ chatId: chat.id }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandListRef.current &&
        !commandListRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button>
                            <FaUserFriends className="transition-all hover:scale-125" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add Friend</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => handleCreateChat(user.id)}>
                            <IoIosChatbubbles className="transition-all hover:scale-125" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send Message</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
