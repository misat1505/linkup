import z from "zod";
import { Chat } from "../chat";
import { SCHEMA_REGISTRY } from "../registry";

export const CreateGroupChatDTO = Chat.pick({ name: true })
	.extend({
		users: z.array(z.string()).openapi({
			description: "List of user IDs to include in the group chat",
			example: ["user_1", "user_2"],
		}),

		file: z.any().optional().openapi({
			description: "Optional group avatar (image file)",
			type: "string",
			format: "binary",
		}),
	})
	.openapi(SCHEMA_REGISTRY.DTO.CREATE_GROUP_CHAT_DTO);

export type CreateGroupChatDTO = z.infer<typeof CreateGroupChatDTO>;
