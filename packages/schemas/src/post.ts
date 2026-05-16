import z from "zod";
import { Chat } from "./chat";
import { SCHEMA_REGISTRY } from "./registry";
import { User } from "./user";

const PostChat = Chat.pick({
	id: true,
	createdAt: true,
	type: true,
})
	.strict()
	.openapi(SCHEMA_REGISTRY.POST_CHAT);

export const Post = z
	.object({
		id: z.uuid().openapi({
			description: "Unique identifier of the post",
			example: "550e8400-e29b-41d4-a716-446655440000",
		}),
		content: z.string().openapi({
			description: "Content of the post",
			example: "This is my first post",
		}),
		createdAt: z.coerce.date().openapi({
			description: "Date when the post was created",
			example: "2024-01-01T12:00:00.000Z",
		}),
		chat: PostChat.openapi({
			description: "Chat associated with the post",
		}),
		author: User.strict().openapi({
			description: "Author of the post",
		}),
	})
	.openapi(SCHEMA_REGISTRY.POST);

export type Post = z.infer<typeof Post>;
