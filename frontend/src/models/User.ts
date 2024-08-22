export type User = {
  id: string;
  firstName: string;
  lastName: string;
  photoURL: string | null;
  lastActive: Date;
};

export const users: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-20T14:00:00Z")
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-21T15:00:00Z")
  },
  {
    id: "3",
    firstName: "Alice",
    lastName: "Johnson",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-22T16:00:00Z")
  },
  {
    id: "4",
    firstName: "Bob",
    lastName: "Brown",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-19T13:00:00Z")
  },
  {
    id: "5",
    firstName: "Charlie",
    lastName: "Davis",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-18T12:00:00Z")
  },
  {
    id: "6",
    firstName: "Diana",
    lastName: "Miller",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-17T11:00:00Z")
  },
  {
    id: "7",
    firstName: "Ethan",
    lastName: "Garcia",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-16T10:00:00Z")
  },
  {
    id: "8",
    firstName: "Fiona",
    lastName: "Martinez",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-15T09:00:00Z")
  },
  {
    id: "9",
    firstName: "George",
    lastName: "Taylor",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-14T08:00:00Z")
  },
  {
    id: "10",
    firstName: "Hannah",
    lastName: "Wilson",
    photoURL: "dbf732a7-8dc8-4a17-b4b5-8e36819aaab5.webp",
    lastActive: new Date("2024-08-13T07:00:00Z")
  }
];
