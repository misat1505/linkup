import { Friendship } from "../types/Friendship";
import FriendsTable from "../components/friends/FriendsTable";
import React, { useState } from "react";
import { User } from "../types/User";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import { createFullName } from "../utils/createFullName";
import { Input } from "../components/ui/input";
import { Table } from "../components/ui/table";
import StatusFilterDropdown from "../components/friends/StatusFilterDropdown";
import Avatar from "../components/common/Avatar";
import { buildFileURL } from "../utils/buildFileURL";
import { getInitials } from "../utils/getInitials";

const users: User[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    photoURL: "https://example.com/photos/alice.jpg",
    lastActive: new Date("2024-11-29T12:00:00Z")
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    photoURL: null,
    lastActive: new Date("2024-11-30T15:30:00Z")
  },
  {
    id: "3",
    firstName: "Carol",
    lastName: "Davis",
    photoURL:
      "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
    lastActive: new Date("2024-11-28T18:45:00Z")
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Miller",
    photoURL: "https://example.com/photos/david.jpg",
    lastActive: new Date("2024-11-30T10:15:00Z")
  }
];

const me = users[0];

const friendships: Friendship[] = [
  {
    requester: me,
    acceptor: users[1],
    status: "PENDING"
  },
  {
    requester: users[2],
    acceptor: me,
    status: "PENDING"
  },
  {
    requester: me,
    acceptor: users[3],
    status: "PENDING"
  },
  {
    requester: users[3],
    acceptor: me,
    status: "ACCEPTED"
  }
];

const columns: ColumnDef<Friendship>[] = [
  {
    cell: ({ row }) => {
      const friendship = row.original as Friendship;

      const otherUser =
        friendship.requester.id === me.id
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
    header: "User",
    accessorKey: "user",
    filterFn: (row, columnId, filterValue) => {
      const friendship = row.original as Friendship;

      const otherUser =
        friendship.requester.id === me.id
          ? friendship.acceptor
          : friendship.requester;

      const fullName = `${otherUser.firstName} ${otherUser.lastName}`;
      return fullName.toLowerCase().includes(filterValue.toLowerCase());
    }
  },
  {
    cell: ({ row }) => {
      const friendship = row.original as Friendship;

      if (friendship.status === "ACCEPTED")
        return <div className="text-emerald-500">Friends</div>;

      const isMineRequest = friendship.requester.id === me.id;

      if (isMineRequest)
        return `Awaiting ${createFullName(friendship.acceptor)} approve`;

      return `Awaiting your approve`;
    },
    header: "Status",
    accessorKey: "status",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const status = row.getValue(columnId);
      const friendship = row.original as Friendship;

      if (filterValue === "Accepted") return status === "ACCEPTED";
      if (filterValue === "Awaiting me")
        return status === "PENDING" && friendship.acceptor.id === me.id;
      if (filterValue === "Awaiting other")
        return status === "PENDING" && friendship.requester.id === me.id;
      return true;
    }
  }
];

export default function Friends() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: friendships,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters
    }
  });

  return (
    <div className="mx-auto my-4 w-1/2 rounded-md bg-slate-100 p-4 dark:bg-slate-900">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter users..."
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
