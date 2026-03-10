import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MdKeyboardArrowDown } from "react-icons/md";
import { I18nText } from "@/components/shared/I18nText";
import Tooltip from "@/components/shared/Tooltip";
import { Friendship } from "../schemas/friendship";
import useCountStatusCategories from "../hooks/useCountStatusCategories";

type StatusFilterDropdownProps = {
  table: Table<Friendship>;
};

export default function StatusFilterDropdown({
  table,
}: StatusFilterDropdownProps) {
  const friendships = table.options.data;
  const counts = useCountStatusCategories(friendships);

  const getButtonText = (): React.ReactNode => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string;

    if (filterValue === "Accepted")
      return (
        <I18nText translationKey="friends.filter.statuses.input.accepted" />
      );
    if (filterValue === "Awaiting me")
      return (
        <I18nText translationKey="friends.filter.statuses.input.awaiting-me" />
      );
    if (filterValue === "Awaiting other")
      return (
        <I18nText translationKey="friends.filter.statuses.input.awaiting-other" />
      );
    return <I18nText translationKey="friends.filter.statuses.input.all" />;
  };

  return (
    <DropdownMenu>
      <Tooltip
        content={
          <I18nText translationKey="friends.filter.statuses.input.placeholder" />
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
          <I18nText
            translationKey="friends.filter.statuses.all"
            values={{
              count: Object.values(counts).reduce((acc, curr) => acc + curr, 0),
            }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => table.getColumn("status")?.setFilterValue("Accepted")}
        >
          <I18nText
            translationKey="friends.filter.statuses.accepted"
            values={{ count: counts.accepted }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting me")
          }
        >
          <I18nText
            translationKey="friends.filter.statuses.awaiting-me"
            values={{
              count: counts.awaitingMe,
            }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting other")
          }
        >
          <I18nText
            translationKey="friends.filter.statuses.awaiting-other"
            values={{
              count: counts.awaitingOther,
            }}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
