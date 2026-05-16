import z from "zod";
import { SCHEMA_REGISTRY } from "./registry";
import { User } from "./user";

export const Friendship = z
	.object({
		requester: User.strict().openapi({
			description: "User who sent the friend request",
		}),
		acceptor: User.strict().openapi({
			description: "User who received the friend request",
		}),
		status: z.enum(["PENDING", "ACCEPTED"]).openapi({
			description: "Current status of the friendship",
			example: "PENDING",
		}),
	})
	.openapi(SCHEMA_REGISTRY.FRIENDSHIP);

export type Friendship = z.infer<typeof Friendship>;
