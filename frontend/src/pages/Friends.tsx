import { Friendship } from "../types/Friendship";
import FriendsTable from "../components/friends/FriendsTable";
import React from "react";
import { User } from "../types/User";
import { ColumnDef } from "@tanstack/react-table";
import { createFullName } from "../utils/createFullName";

export default function Friends() {
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
      photoURL: "https://example.com/photos/carol.jpg",
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
          friendship.requester.id === users[0].id
            ? friendship.acceptor
            : friendship.requester;

        return `${otherUser.firstName} ${otherUser.lastName}`;
      },
      header: "User",
      accessorKey: "user",
      filterFn: (row, columnId, filterValue) => {
        const friendship = row.original as Friendship;

        const otherUser =
          friendship.requester.id === users[0].id
            ? friendship.acceptor
            : friendship.requester;

        const fullName = `${otherUser.firstName} ${otherUser.lastName}`;
        return fullName.toLowerCase().includes(filterValue.toLowerCase());
      }
    },
    {
      cell: ({ row }) => {
        const friendship = row.original as Friendship;

        if (friendship.status === "ACCEPTED") return "Friends";

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

  return (
    <div className="mx-auto my-4 w-96">
      <FriendsTable columns={columns} data={friendships} />
    </div>
  );
}
