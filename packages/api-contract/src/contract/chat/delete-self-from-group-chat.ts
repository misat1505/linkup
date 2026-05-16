import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { Chat } from "@packages/schemas";
import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

export const deleteSelfFromGroupChatRoute = {
	method: "delete",
	path: "/chats/{chatId}/users",
	summary: "Remove a user from a group chat",
	tags: [TAGS.CHATS],

	request: {
		params: z.object({
			chatId: Chat.shape.id,
		}),
	},

	responses: {
		[StatusCodes.OK]: response.json({
			schema: z.object({
				message: z.string(),
			}),
			description: "Successfully removed from chat",
		}),

		[StatusCodes.BAD_REQUEST]: errors.badRequest({
			description: "User is not in chat or chat type does not allow removal",
		}),
	},
} satisfies RouteConfig;
