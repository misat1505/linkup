import { Friendship } from "../../types/Friendship";
import { Table } from "@tanstack/react-table";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Tooltip from "../common/Tooltip";
import useCountStatusCategories from "../../hooks/friends/useCountStatusCategories";

type StatusFilterDropdownProps = {
  table: Table<Friendship>;
};

export default function StatusFilterDropdown({
  table
}: StatusFilterDropdownProps) {
  const counts = useCountStatusCategories();

  return (
    <DropdownMenu>
      <Tooltip content="Filter statuses">
        <span>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              {(table.getColumn("status")?.getFilterValue() as string) || "All"}
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
