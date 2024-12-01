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

type StatusFilterDropdownProps = {
  table: Table<Friendship>;
};

export default function StatusFilterDropdown({
  table
}: StatusFilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {(table.getColumn("status")?.getFilterValue() as string) ||
            "All Statuses"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => table.getColumn("status")?.setFilterValue("")}
        >
          All
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => table.getColumn("status")?.setFilterValue("Accepted")}
        >
          Accepted
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting me")
          }
        >
          Awaiting me
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            table.getColumn("status")?.setFilterValue("Awaiting other")
          }
        >
          Awaiting other
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
