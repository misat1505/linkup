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
  const dropdownItems: JSX.Element[] = [];

  const isMineRequest = friendship.requester.id === me!.id;

  if (!isMineRequest && friendship.status === "PENDING")
    dropdownItems.push(
      <>
        <DropdownMenuItem>
          <TiTick />
          <span>Accept</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </>
    );

  dropdownItems.push(
    <DropdownMenuItem className="!text-red-500">
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
