import z from "zod";

export const InsertToCacheDTO = z.object({
  file: z.any().optional().openapi({
    description: "The file to be inserted into the cache.",
    type: "string",
    format: "binary",
  }),
});

export type InsertToCacheDTO = z.infer<typeof InsertToCacheDTO>;
