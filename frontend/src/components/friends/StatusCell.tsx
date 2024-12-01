import { Friendship } from "../../types/Friendship";
import { createFullName } from "../../utils/createFullName";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import Tooltip from "../common/Tooltip";
import { useAppContext } from "../../contexts/AppProvider";
import { FriendService } from "../../services/Friend.service";
import { useQueryClient } from "react-query";
import { queryKeys } from "../../lib/queryKeys";
import { useToast } from "../ui/use-toast";

type StatusCellProps = { friendship: Friendship };

export default function StatusCell({ friendship }: StatusCellProps) {
  return (
    <div className="flex items-center justify-between">
      <StatusDisplay friendship={friendship} />
      <StatusDropdown friendship={friendship} />
    </div>
  );
}

function StatusDisplay({ friendship }: StatusCellProps) {
  const { user: me } = useAppContext();

  if (friendship.status === "ACCEPTED")
    return <div className="text-emerald-500">Friends</div>;

  const isMineRequest = friendship.requester.id === me!.id;

  if (isMineRequest)
    return <div>Awaiting {createFullName(friendship.acceptor)} approve</div>;

  return <div>Awaiting your approve</div>;
}

function StatusDropdown({ friendship }: StatusCellProps) {
  const { user: me } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dropdownItems: JSX.Element[] = [];

  const isMineRequest = friendship.requester.id === me!.id;

  const handleAcceptFriendship = async () => {
    const newFriendship = await FriendService.acceptFriendship(
      friendship.requester.id,
      friendship.acceptor.id
    );
    queryClient.setQueryData<Friendship[]>(
      queryKeys.friends(),
      (oldFriendships) => {
        if (!oldFriendships) return [newFriendship];
        return oldFriendships.map((fr) => {
          if (
            fr.acceptor.id === newFriendship.acceptor.id &&
            fr.requester.id === newFriendship.requester.id
          )
            return newFriendship;
          return fr;
        });
      }
    );

    const otherUser = isMineRequest
      ? friendship.acceptor
      : friendship.requester;

    const description = `${createFullName(otherUser)} is your friend now.`;

    toast({
      title: "Friendship accepted.",
      description
    });
  };

  const handleDeleteFriendship = async () => {
    await FriendService.deleteFriendship(
      friendship.requester.id,
      friendship.acceptor.id
    );
    queryClient.setQueryData<Friendship[]>(
      queryKeys.friends(),
      (oldFriendships) => {
        if (!oldFriendships) return [];
        return oldFriendships.filter(
          (fr) =>
            fr.acceptor.id !== friendship.acceptor.id ||
            fr.requester.id !== friendship.requester.id
        );
      }
    );

    const otherUser = isMineRequest
      ? friendship.acceptor
      : friendship.requester;

    const getDescription = (): string => {
      if (friendship.status === "ACCEPTED")
        return `${createFullName(otherUser)} is not your friend anymore.`;

      if (isMineRequest)
        return `Friend request to ${createFullName(otherUser)} is removed.`;

      return `${createFullName(otherUser)} friend request is rejected.`;
    };

    toast({
      title: "Friendship deleted.",
      description: getDescription()
    });
  };

  if (!isMineRequest && friendship.status === "PENDING")
    dropdownItems.push(
      <>
        <DropdownMenuItem onClick={handleAcceptFriendship}>
          <TiTick />
          <span>Accept</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </>
    );

  dropdownItems.push(
    <DropdownMenuItem
      onClick={handleDeleteFriendship}
      className="!text-red-500"
    >
      <FaTrash />
      <span>Delete</span>
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0">
          <Tooltip content="Show actions">
            <span>
              <MoreVertical />
            </span>
          </Tooltip>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dropdownItems.map((dropdownItem, idx) => (
          <React.Fragment key={idx}>{dropdownItem}</React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
