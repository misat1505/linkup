import Avatar from "@/components/common/Avatar";
import Tooltip from "@/components/common/Tooltip";
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
import { useChatContext } from "@/contexts/ChatProvider";
import useUserSearch from "@/hooks/useUserSearch";
import { queryKeys } from "@/lib/queryKeys";
import { ChatService } from "@/services/Chat.service";
import { Chat } from "@/types/Chat";
import { User } from "@/types/User";
import { buildFileURL } from "@/utils/buildFileURL";
import { createFullName } from "@/utils/createFullName";
import { getInitials } from "@/utils/getInitials";
import React, { useState } from "react";
import { HiUserAdd } from "react-icons/hi";
import { useQueryClient } from "react-query";

export default function UserInvite() {
  const [text, setText] = useState("");
  const { data } = useUserSearch(text);
  const { chat } = useChatContext();

  const filteredUsers = data?.filter(
    (user) => !chat!.users!.some((u) => u.id === user.id)
  );

  return (
    <div>
      <Input
        placeholder="Search for people..."
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
    return <p className={classes}>Write to search for users.</p>;

  if (users.length === 0) return <p className={classes}>No users found.</p>;

  return (
    <div className="no-scrollbar max-h-[340px] overflow-auto">
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
        <p className="font-semibold">
          {user.firstName} {user.lastName}
        </p>
      </div>
      <UserAddDialog user={user} />
    </div>
  );
}

function UserAddDialog({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const { chatId } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const newUser = await ChatService.addUserToChat(chatId, user.id);

    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (!oldChats) return [];

      const chat = oldChats.find((c) => c.id === chatId)!;
      chat.users?.push(newUser);
      return [...oldChats];
    });
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        <span>
          <Tooltip content={`Invite ${createFullName(user)} to this chat`}>
            <div className="mr-1 rounded-full bg-slate-200 p-1 transition-colors hover:cursor-pointer hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
              <HiUserAdd size={20} />
            </div>
          </Tooltip>
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Invite {createFullName(user)} to this chat
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to invite {createFullName(user)} to this chat?
            Once invited, they will be able to view and participate in the
            conversation. Confirm your action below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Invite</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
