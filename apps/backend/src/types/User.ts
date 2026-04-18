import { z } from "zod";

export const User = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  photoURL: z.string().nullable(),
  lastActive: z.coerce.date()
});

export type User = z.infer<typeof User>;

export const UserWithCredentials = User.extend({
  login: z.string().min(5).max(50),
  password: z.string().min(5),
  salt: z.string(),
});

export type UserWithCredentials = z.infer<typeof UserWithCredentials>;
