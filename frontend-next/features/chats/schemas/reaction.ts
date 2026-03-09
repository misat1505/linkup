import z from "zod";
import { User } from "@/features/auth/schemas/user";

export const Reaction = z.object({
  id: z.string(),
  name: z.string(),
  messageId: z.string(),
  user: User,
});

export type Reaction = z.infer<typeof Reaction>;
