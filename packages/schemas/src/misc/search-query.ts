import { z } from "zod";

export const SearchUserQuery = z.object({
  term: z.string(),
});
export type SearchUserQuery = z.infer<typeof SearchUserQuery>;
