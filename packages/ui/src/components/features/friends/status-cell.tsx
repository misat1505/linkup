import { Friendship, User } from "@packages/schemas";
import { MoreVertical } from "lucide-react";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { TRANSLATION_COMPONENT, useUiPackageContext } from "../../../config";
import { createFullName } from "../../../utils/create-full-name";
import { Tooltip } from "../../misc/tooltip";
import { Button } from "../../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { useToast } from "../../shadcn/use-toast";

export type StatusCellProps = {
  friendship: Friendship;
  me: User;
  acceptFriendshipAction: (
    id1: User["id"],
    id2: User["id"],
  ) => Promise<Friendship>;
  acceptFriendshipCb?: (fr: Friendship) => void;
  deleteFriendshipAction: (id1: User["id"], id2: User["id"]) => Promise<void>;
  deleteFriendshipCb?: (fr: Friendship) => void;
};

export function StatusCell(props: StatusCellProps) {
  return (
    <div className="flex items-center justify-between">
      <StatusDisplay {...props} />
      <StatusDropdown {...props} />
    </div>
  );
}

function StatusDisplay({ friendship, me }: StatusCellProps) {
  if (friendship.status === "ACCEPTED")
    return (
      <div className="text-emerald-500">
        <TRANSLATION_COMPONENT translationKey="friends.cells.statuses.accepted" />
      </div>
    );

  const isMineRequest = friendship.requester.id === me!.id;

  if (isMineRequest)
    return (
      <div>
        <TRANSLATION_COMPONENT
          translationKey="friends.cells.statuses.awaiting-other"
          values={{
            fullName: createFullName(friendship.acceptor),
          }}
        />
      </div>
    );

  return (
    <div>
      <TRANSLATION_COMPONENT translationKey="friends.cells.statuses.awaiting-me" />
    </div>
  );
}

function StatusDropdown({
  friendship,
  me,
  acceptFriendshipAction,
  acceptFriendshipCb,
  deleteFriendshipAction,
  deleteFriendshipCb,
}: StatusCellProps) {
  const { t } = useUiPackageContext();
  const { toast } = useToast();
  const dropdownItems: React.ReactNode[] = [];

  const isMineRequest = friendship.requester.id === me!.id;

  const handleAcceptFriendship = async () => {
    const fr = await acceptFriendshipAction(
      friendship.requester.id,
      friendship.acceptor.id,
    );
    acceptFriendshipCb?.(fr);

    const otherUser = isMineRequest
      ? friendship.acceptor
      : friendship.requester;

    toast({
      title: t("friends.toasts.accepted.title"),
      description: t("friends.toasts.accepted.description", {
        fullName: createFullName(otherUser),
      }),
    });
  };

  const handleDeleteFriendship = async () => {
    await deleteFriendshipAction(
      friendship.requester.id,
      friendship.acceptor.id,
    );
    deleteFriendshipCb?.(friendship);

    const otherUser = isMineRequest
      ? friendship.acceptor
      : friendship.requester;

    const getDescription = (): string => {
      const fullName = createFullName(otherUser);

      if (friendship.status === "ACCEPTED")
        return t("friends.toasts.deleted.description.accepted", { fullName });

      if (isMineRequest)
        return t("friends.toasts.deleted.description.awaiting-other", {
          fullName,
        });

      return t("friends.toasts.deleted.description.awaiting-me", { fullName });
    };

    toast({
      title: t("friends.toasts.deleted.title"),
      description: getDescription(),
    });
  };

  if (!isMineRequest && friendship.status === "PENDING")
    dropdownItems.push(
      <>
        <DropdownMenuItem onClick={handleAcceptFriendship}>
          <TiTick />
          <span>
            <TRANSLATION_COMPONENT translationKey="friends.cells.actions.accept" />
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </>,
    );

  dropdownItems.push(
    <DropdownMenuItem
      onClick={handleDeleteFriendship}
      className="!text-red-500"
    >
      <FaTrash />
      <span>
        <TRANSLATION_COMPONENT translationKey="friends.cells.actions.delete" />
      </span>
    </DropdownMenuItem>,
  );

  return (
    <DropdownMenu>
      <Tooltip
        content={
          <TRANSLATION_COMPONENT translationKey="friends.cells.actions.trigger.tooltip" />
        }
      >
        <span>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
        </span>
      </Tooltip>
      <DropdownMenuContent align="end">
        {dropdownItems.map((dropdownItem, idx) => (
          <React.Fragment key={idx}>{dropdownItem}</React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
