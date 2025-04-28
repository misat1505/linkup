import { z } from "zod";

export const File = z.object({
  id: z.string().uuid(),
  url: z.string(),
});

export type File = z.infer<typeof File>;
