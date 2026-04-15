import z from "zod";

export const User = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  photoURL: z.string().nullable(),
  lastActive: z.coerce.date(),
});

export type User = z.infer<typeof User>;
