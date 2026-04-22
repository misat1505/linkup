import z from "zod";

export const GetPostsQuery = z.object({
  lastPostId: z.string().transform((val) => (val === "null" ? null : val)),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val <= 10, {
      message: "Limit must be a valid number not greater than 10",
    }),
});
export type GetPostsQuery = z.infer<typeof GetPostsQuery>;
