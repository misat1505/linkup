import { z } from "zod";

export const chatFormSchema = z
  .object({
    content: z.string(),
    files: z.array(z.instanceof(File)).optional(),
    responseId: z.string().nullable()
  })
  .refine(
    (data) => {
      return (
        data.content.trim().length > 0 || (data.files && data.files.length > 0)
      );
    },
    {
      message: "You must provide some text or upload at least one file.",
      path: ["content"]
    }
  );

export type ChatFormType = z.infer<typeof chatFormSchema>;
