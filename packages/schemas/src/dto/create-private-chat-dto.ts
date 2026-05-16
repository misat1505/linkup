import z from "zod";
import { SCHEMA_REGISTRY } from "../registry";

export const CreatePrivateChatDTO = z
	.object({
		users: z.array(z.uuid()).length(2),
	})
	.openapi(SCHEMA_REGISTRY.DTO.CREATE_PRIVATE_CHAT_DTO);

export type CreatePrivateChatDTO = z.infer<typeof CreatePrivateChatDTO>;
