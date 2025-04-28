import { z } from "zod";
import { User } from "./User";

export const Reaction = z.object({
  id: z.string().uuid(),
  name: z.string(),
  messageId: z.string().uuid(),
  user: User,
});

export type Reaction = z.infer<typeof Reaction>;
