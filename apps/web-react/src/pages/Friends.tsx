import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery, useQueryClient } from "react-query";
import { queryKeys } from "@/lib/queryKeys";
import { FriendService } from "@/services/Friend.service";
import Loading from "@/components/common/Loading";
import { useAppContext } from "@/contexts/AppProvider";
import { Friendship } from "@/types/Friendship";
import Avatar from "@/components/common/Avatar";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";
import { createFullName } from "@/utils/createFullName";
import StatusCell from "@/components/friends/StatusCell";
import { Input } from "@/components/ui/input";
import StatusFilterDropdown from "@/components/friends/StatusFilterDropdown";
import { Table } from "@/components/ui/table";
import FriendsTable from "@/components/friends/FriendsTable";
import { useTranslation } from "react-i18next";
import useChangeTabTitle from "@/hooks/useChangeTabTitle";

export default function Friends() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.friends"));

  const { isLoading } = useQuery({
    queryKey: queryKeys.friends(),
    queryFn: FriendService.getMyFriendships,
  });

  if (isLoading)
    return (
      <div className="relative mt-[-5rem] h-screen">
        <Loading />
      </div>
    );

  return <FriendsPageInner />;
}

function FriendsPageInner() {
  const { t } = useTranslation();
  const { user: me } = useAppContext();
  const columns: ColumnDef<Friendship>[] = [
    {
      cell: ({ row }) => {
        const friendship = row.original as Friendship;

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
        const friendship = row.original as Friendship;

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
        const friendship = row.original as Friendship;

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
  const queryClient = useQueryClient();
  const table = useReactTable({
    data: (queryClient.getQueryData(queryKeys.friends()) as Friendship[]) || [],
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
