import z from "zod";
import { SCHEMA_REGISTRY } from "./registry";
import { User } from "./user";

export const Reaction = z
	.object({
		id: z.uuid().openapi({
			description: "Unique identifier of the reaction",
			example: "550e8400-e29b-41d4-a716-446655440000",
		}),
		name: z.string().openapi({
			description: "Reaction type or emoji",
			example: "happy",
		}),
		messageId: z.uuid().openapi({
			description: "ID of the message this reaction belongs to",
			example: "660e8400-e29b-41d4-a716-446655440000",
		}),
		user: User.strict().openapi({
			description: "User who added the reaction",
		}),
	})
	.openapi(SCHEMA_REGISTRY.REACTION);

export type Reaction = z.infer<typeof Reaction>;
