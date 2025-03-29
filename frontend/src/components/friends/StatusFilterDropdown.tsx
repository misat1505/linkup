import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Friendship } from "@/types/Friendship";
import useCountStatusCategories from "@/hooks/friends/useCountStatusCategories";
import Tooltip from "../common/Tooltip";
import { useTranslation } from "react-i18next";

type StatusFilterDropdownProps = {
  table: Table<Friendship>;
};

export default function StatusFilterDropdown({
  table,
}: StatusFilterDropdownProps) {
  const { t } = useTranslation();
  const counts = useCountStatusCategories();

  const getButtonText = (): string => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string;

    if (filterValue === "Accepted")
      return t("friends.filter.statuses.input.accepted");
    if (filterValue === "Awaiting me")
      return t("friends.filter.statuses.input.awaiting-me");
    if (filterValue === "Awaiting other")
      return t("friends.filter.statuses.input.awaiting-other");
    return t("friends.filter.statuses.input.all");
  };

  return (
    <DropdownMenu>
      <Tooltip content={t("friends.filter.statuses.input.placeholder")}>
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
          {t("friends.filter.statuses.all", {
            count: Object.values(counts).reduce((acc, curr) => acc + curr, 0),
          })}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => table.getColumn("status")?.setFilterValue("Accepted")}
        >
          {t("friends.filter.statuses.accepted", { count: counts.accepted })}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting me")
          }
        >
          {t("friends.filter.statuses.awaiting-me", {
            count: counts.awaitingMe,
          })}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting other")
          }
        >
          {t("friends.filter.statuses.awaiting-other", {
            count: counts.awaitingOther,
          })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
