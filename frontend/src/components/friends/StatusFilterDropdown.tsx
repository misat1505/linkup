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

type StatusFilterDropdownProps = {
  table: Table<Friendship>;
};

export default function StatusFilterDropdown({
  table,
}: StatusFilterDropdownProps) {
  const counts = useCountStatusCategories();

  return (
    <DropdownMenu>
      <Tooltip content="Filter statuses">
        <span>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-4 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <span>
                {(table.getColumn("status")?.getFilterValue() as string) ||
                  "All"}
              </span>
              <MdKeyboardArrowDown />
            </Button>
          </DropdownMenuTrigger>
        </span>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => table.getColumn("status")?.setFilterValue("")}
        >
          All ({Object.values(counts).reduce((acc, curr) => acc + curr, 0)})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => table.getColumn("status")?.setFilterValue("Accepted")}
        >
          Accepted ({counts.accepted})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting me")
          }
        >
          Awaiting me ({counts.awaitingMe})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting other")
          }
        >
          Awaiting other ({counts.awaitingOther})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
