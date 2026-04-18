import z from "zod";

export const User = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  photoURL: z.string().nullable(),
  lastActive: z.coerce.date(),
});

export type User = z.infer<typeof User>;
