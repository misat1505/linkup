import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Friendship } from "@/types/Friendship";
import { useAppContext } from "@/contexts/AppProvider";
import { useToast } from "../ui/use-toast";
import { queryKeys } from "@/lib/queryKeys";
import { FriendService } from "@/services/Friend.service";
import { useQueryClient } from "react-query";
import { createFullName } from "@/utils/createFullName";
import { FaTrash } from "react-icons/fa";
import Tooltip from "../common/Tooltip";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { TiTick } from "react-icons/ti";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { user: me } = useAppContext();

  if (friendship.status === "ACCEPTED")
    return (
      <div className="text-emerald-500">
        {t("friends.cells.statuses.accepted")}
      </div>
    );

  const isMineRequest = friendship.requester.id === me!.id;

  if (isMineRequest)
    return (
      <div>
        {t("friends.cells.statuses.awaiting-other", {
          fullName: createFullName(friendship.acceptor),
        })}
      </div>
    );

  return <div>{t("friends.cells.statuses.awaiting-me")}</div>;
}

function StatusDropdown({ friendship }: StatusCellProps) {
  const { t } = useTranslation();
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

    toast({
      title: t("friends.toasts.accepted.title"),
      description: t("friends.toasts.accepted.description", {
        fullName: createFullName(otherUser),
      }),
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
          <span>{t("friends.cells.actions.accept")}</span>
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
      <span>{t("friends.cells.actions.delete")}</span>
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <Tooltip content={t("friends.cells.actions.trigger.tooltip")}>
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
