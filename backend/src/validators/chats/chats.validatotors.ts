import { z } from "zod";

export const CreateGroupChatDTO = z
  .object({
    users: z.array(z.string().uuid()).min(1),

    name: z.string().max(100).optional().nullable(),
  })
  .strict();
export type CreateGroupChatDTO = z.infer<typeof CreateGroupChatDTO>;

export const CreatePrivateChatDTO = z
  .object({
    users: z.array(z.string().uuid()).length(2),
  })
  .strict();
export type CreatePrivateChatDTO = z.infer<typeof CreatePrivateChatDTO>;

export const UpdateAliasDTO = z.object({
  alias: z.string().max(100).nullable(),
});
export type UpdateAliasDTO = z.infer<typeof UpdateAliasDTO>;

export const UpdateGroupChatDTO = z.object({
  name: z.string().max(100).optional(),
});
export type UpdateGroupChatDTO = z.infer<typeof UpdateGroupChatDTO>;
