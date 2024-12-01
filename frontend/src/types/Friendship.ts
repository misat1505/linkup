import { User } from "./User";

export type Friendship = {
  requester: User;
  acceptor: User;
  status: "PENDING" | "ACCEPTED";
};
