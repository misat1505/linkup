import { Friendship, User } from "@packages/schemas";
import { Table } from "@tanstack/react-table";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TRANSLATION_COMPONENT } from "../../../config";
import useCountStatusCategories from "../../../hooks/use-count-status-categories";
import Tooltip from "../../misc/tooltip";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shadcn";

type StatusFilterDropdownProps = {
  me: User;
  table: Table<Friendship>;
};

export function StatusFilterDropdown({ me, table }: StatusFilterDropdownProps) {
  const friendships = table.options.data;
  const counts = useCountStatusCategories(me, friendships);

  const getButtonText = (): React.ReactNode => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string;

    if (filterValue === "Accepted")
      return (
        <TRANSLATION_COMPONENT translationKey="friends.filter.statuses.input.accepted" />
      );
    if (filterValue === "Awaiting me")
      return (
        <TRANSLATION_COMPONENT translationKey="friends.filter.statuses.input.awaiting-me" />
      );
    if (filterValue === "Awaiting other")
      return (
        <TRANSLATION_COMPONENT translationKey="friends.filter.statuses.input.awaiting-other" />
      );
    return (
      <TRANSLATION_COMPONENT translationKey="friends.filter.statuses.input.all" />
    );
  };

  return (
    <DropdownMenu>
      <Tooltip
        content={
          <TRANSLATION_COMPONENT translationKey="friends.filter.statuses.input.placeholder" />
        }
      >
        <span>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-4 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <span>{getButtonText()}</span>
              <MdKeyboardArrowDown />
            </Button>
          </DropdownMenuTrigger>
        </span>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => table.getColumn("status")?.setFilterValue("")}
        >
          <TRANSLATION_COMPONENT
            translationKey="friends.filter.statuses.all"
            values={{
              count: String(
                Object.values(counts).reduce((acc, curr) => acc + curr, 0),
              ),
            }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => table.getColumn("status")?.setFilterValue("Accepted")}
        >
          <TRANSLATION_COMPONENT
            translationKey="friends.filter.statuses.accepted"
            values={{ count: String(counts.accepted) }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting me")
          }
        >
          <TRANSLATION_COMPONENT
            translationKey="friends.filter.statuses.awaiting-me"
            values={{
              count: String(counts.awaitingMe),
            }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting other")
          }
        >
          <TRANSLATION_COMPONENT
            translationKey="friends.filter.statuses.awaiting-other"
            values={{
              count: String(counts.awaitingOther),
            }}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
