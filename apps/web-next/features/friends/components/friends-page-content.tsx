"use client";
import Avatar from "@/components/shared/avatar";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { buildFileURL } from "@/utils/build-file-url";
import { createFullName } from "@/utils/create-full-name";
import { getInitials } from "@/utils/get-initials";
import { Friendship } from "@packages/schemas";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import FriendsTable from "./friends-table";
import StatusCell from "./status-cell";
import StatusFilterDropdown from "./status-filter-dropdown";

type FriendsPageContentProps = {
  friendships: Friendship[];
};

export function FriendsPageContent({ friendships }: FriendsPageContentProps) {
  const { t } = useLanguageContext();
  const { user: me } = useAppContext();
  const columns: ColumnDef<Friendship>[] = [
    {
      cell: ({ row }) => {
        const friendship = row.original;

        const otherUser =
          friendship.requester.id === me!.id
            ? friendship.acceptor
            : friendship.requester;

        return (
          <div className="flex items-center space-x-4">
            <Avatar
              src={buildFileURL(otherUser.photoURL, { type: "avatar" })}
              alt={getInitials(otherUser)}
              className="h-8 w-8 text-xs"
            />
            <p className="font-semibold">{createFullName(otherUser)}</p>
          </div>
        );
      },
      header: t("friends.column.user.title"),
      accessorKey: "user",
      filterFn: (row, _, filterValue) => {
        const friendship = row.original;

        const otherUser =
          friendship.requester.id === me!.id
            ? friendship.acceptor
            : friendship.requester;

        const fullName = `${otherUser.firstName} ${otherUser.lastName}`;
        return fullName.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      cell: ({ row }) => {
        const friendship = row.original;

        return <StatusCell friendship={friendship} />;
      },
      header: t("friends.column.status.title"),
      accessorKey: "status",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const status = row.getValue(columnId);
        const friendship = row.original as Friendship;

        if (filterValue === "Accepted") return status === "ACCEPTED";
        if (filterValue === "Awaiting me")
          return status === "PENDING" && friendship.acceptor.id === me!.id;
        if (filterValue === "Awaiting other")
          return status === "PENDING" && friendship.requester.id === me!.id;
        return true;
      },
    },
  ];
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: friendships,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="mx-auto my-4 w-[95%] bg-slate-100 p-4 shadow-lg dark:bg-slate-900 lg:w-1/2">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder={t("friends.filter.input.placeholder")}
          value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("user")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <StatusFilterDropdown table={table} />
      </div>
      <Table className="rounded-md border">
        <FriendsTable table={table} />
      </Table>
    </div>
  );
}
