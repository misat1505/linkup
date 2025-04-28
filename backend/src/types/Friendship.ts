import { z } from "zod";
import { User } from "./User";

export const Friendship = z.object({
  requester: User.strict(),
  acceptor: User.strict(),
  status: z.enum(["PENDING", "ACCEPTED"]),
});

export type Friendship = z.infer<typeof Friendship>;
