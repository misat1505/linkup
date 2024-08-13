import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "../../ui/command";
import { useState } from "react";
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

export default function NavbarSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);

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

  return (
    <Command className="w-60 rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search on Link Up..."
        onInput={(e) => setText(e.currentTarget.value)}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => setIsExpanded(false)}
      />
      <CommandList
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
              {users.map((user, idx) => (
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
                          <button>
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
