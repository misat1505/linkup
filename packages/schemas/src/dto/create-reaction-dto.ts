import z from "zod";
import { SCHEMA_REGISTRY } from "../registry";

export const CreateReactionDTO = z
	.object({
		reactionId: z.uuid(),
		messageId: z.uuid(),
	})
	.openapi(SCHEMA_REGISTRY.DTO.CREATE_REACTION_DTO);

export type CreateReactionDTO = z.infer<typeof CreateReactionDTO>;
