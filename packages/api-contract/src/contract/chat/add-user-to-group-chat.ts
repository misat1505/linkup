import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { Chat, User, UserInChat } from "@packages/schemas";
import { z } from "zod";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const addUserToGroupChatRoute = {
	method: "post",
	path: "/chats/{chatId}/users",
	summary: "Add a user to a group chat",
	tags: [TAGS.CHATS],

	request: {
		params: z.object({
			chatId: Chat.shape.id,
		}),

		body: request.json({
			schema: z.object({
				userId: User.shape.id,
			}),
		}),
	},

	responses: {
		[StatusCodes.CREATED]: response.json({
			schema: z.object({
				user: UserInChat,
			}),
			description: "User added to chat successfully",
		}),

		[StatusCodes.BAD_REQUEST]: errors.badRequest({
			description: "Cannot add users to this type of chat",
		}),

		[StatusCodes.FORBIDDEN]: errors.forbidden({
			description: "User not authorized to add to this chat",
		}),

		[StatusCodes.CONFLICT]: errors.conflict({
			description: "User is already in this chat",
		}),
	},
} satisfies RouteConfig;
