import { User } from "@/features/auth/schemas/user";
import z from "zod";

export const Friendship = z.object({
  requester: User,
  acceptor: User,
  status: z.enum(["PENDING", "ACCEPTED"]),
});

export type Friendship = z.infer<typeof Friendship>;
