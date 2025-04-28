import { z } from "zod";
import { User } from "./User";

export const Friendship = z.object({
  requester: User,
  acceptor: User,
  status: z.enum(["PENDING", "ACCEPTED"]),
});

export type Friendship = z.infer<typeof Friendship>;
