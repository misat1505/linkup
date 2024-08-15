import { User } from "./User";

export type Chat = {
  id: string;
  createdAt: Date;
  photoURL: string | null;
  type: "PRIVATE" | "GROUP" | "POST";
  users: User[] | null;
};
