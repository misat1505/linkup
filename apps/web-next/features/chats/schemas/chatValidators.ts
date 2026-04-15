import { z } from "zod";

export const chatFormSchema = z
  .object({
    content: z.string(),
    files: z.array(z.instanceof(File)).optional(),
    responseId: z.string().nullable().optional()
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

const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  photoURL: z.string().nullable(),
  lastActive: z.date()
});

export const newGroupChatFormSchema = z.object({
  name: z.string().optional(),
  file: z.optional(z.instanceof(FileList)),
  users: z.array(userSchema)
});

export type NewGroupChatFormType = z.infer<typeof newGroupChatFormSchema>;
