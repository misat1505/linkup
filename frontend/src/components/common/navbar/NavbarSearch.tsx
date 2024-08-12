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

const users: User[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson Johnson",
    photoURL:
      "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    lastActive: new Date("2024-08-01T10:30:00Z")
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    photoURL:
      "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
    lastActive: new Date("2024-08-02T11:15:00Z")
  },
  {
    id: "3",
    firstName: "Charlie",
    lastName: "Brown",
    photoURL:
      "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg",
    lastActive: new Date("2024-08-03T12:00:00Z")
  },
  {
    id: "4",
    firstName: "Diana",
    lastName: "Prince",
    photoURL:
      "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg",
    lastActive: new Date("2024-08-04T13:45:00Z")
  },
  {
    id: "5",
    firstName: "Edward",
    lastName: "Norton",
    photoURL:
      "https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg",
    lastActive: new Date("2024-08-05T14:30:00Z")
  },
  {
    id: "6",
    firstName: "Fiona",
    lastName: "Gilbert",
    photoURL:
      "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
    lastActive: new Date("2024-08-06T15:15:00Z")
  },
  {
    id: "7",
    firstName: "George",
    lastName: "Martinez",
    photoURL: "https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649",
    lastActive: new Date("2024-08-07T16:00:00Z")
  },
  {
    id: "8",
    firstName: "Hannah",
    lastName: "Lee",
    photoURL:
      "https://images.ctfassets.net/hrltx12pl8hq/01rJn4TormMsGQs1ZRIpzX/16a1cae2440420d0fd0a7a9a006f2dcb/Artboard_Copy_231.jpg?fit=fill&w=600&h=600",
    lastActive: new Date("2024-08-08T16:45:00Z")
  },
  {
    id: "9",
    firstName: "Isaac",
    lastName: "Kim",
    photoURL:
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg",
    lastActive: new Date("2024-08-09T17:30:00Z")
  },
  {
    id: "10",
    firstName: "Jessica",
    lastName: "Williams",
    photoURL: "https://pixlr.com/images/index/ai-image-generator-one.webp",
    lastActive: new Date("2024-08-10T18:15:00Z")
  }
];

async function filterUsers(text: string): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!text) return resolve(users);
      return resolve(
        users.filter(
          (user) =>
            user.firstName.toLowerCase().startsWith(text.toLowerCase()) ||
            user.lastName.toLowerCase().startsWith(text.toLowerCase())
        )
      );
    }, 1000);
  });
}

export default function NavbarSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);

  const { data: users = [], isFetching } = useQuery({
    queryKey: ["users", { debouncedText }],
    queryFn: () => filterUsers(debouncedText),
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
              <CommandEmpty>No users found.</CommandEmpty>
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
                        common: "h-8 w-8 rounded-full object-cover"
                      }}
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
