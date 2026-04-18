import { User } from "@packages/schemas";
import { z } from "zod";

export const UserWithCredentials = User.extend({
  login: z.string().min(5).max(50),
  password: z.string().min(5),
  salt: z.string(),
});

export type UserWithCredentials = z.infer<typeof UserWithCredentials>;
