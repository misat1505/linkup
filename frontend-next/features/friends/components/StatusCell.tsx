import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createFullName } from "@/utils/createFullName";
import { FaTrash } from "react-icons/fa";
import { MoreVertical } from "lucide-react";
import { TiTick } from "react-icons/ti";
import { I18nText } from "@/components/shared/I18nText";
import { Friendship } from "../schemas/friendship";
import { useAppContext } from "@/providers/AppProvider";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { useToast } from "@/components/ui/use-toast";
import { acceptFriendship } from "../actions/acceptFriendship";
import { deleteFriendship } from "../actions/deleteFriendship";
import Tooltip from "@/components/shared/Tooltip";
import { Button } from "@/components/ui/button";

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
    return (
      <div className="text-emerald-500">
        <I18nText translationKey="friends.cells.statuses.accepted" />
      </div>
    );

  const isMineRequest = friendship.requester.id === me!.id;

  if (isMineRequest)
    return (
      <div>
        <I18nText
          translationKey="friends.cells.statuses.awaiting-other"
          values={{
            fullName: createFullName(friendship.acceptor),
          }}
        />
      </div>
    );

  return (
    <div>
      <I18nText translationKey="friends.cells.statuses.awaiting-me" />
    </div>
  );
}

function StatusDropdown({ friendship }: StatusCellProps) {
  const { t } = useLanguageContext();
  const { user: me } = useAppContext();
  const { toast } = useToast();
  const dropdownItems: React.ReactNode[] = [];

  const isMineRequest = friendship.requester.id === me!.id;

  const handleAcceptFriendship = async () => {
    await acceptFriendship(friendship.requester.id, friendship.acceptor.id);

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
    await deleteFriendship(friendship.requester.id, friendship.acceptor.id);

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
            <I18nText translationKey="friends.cells.actions.accept" />
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
        <I18nText translationKey="friends.cells.actions.delete" />
      </span>
    </DropdownMenuItem>,
  );

  return (
    <DropdownMenu>
      <Tooltip
        content={
          <I18nText translationKey="friends.cells.actions.trigger.tooltip" />
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
