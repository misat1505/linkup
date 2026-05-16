import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Chat, CreateGroupChatDTO } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const createGroupChatRoute = {
	method: "post",
	path: "/chats/group",
	summary: "Create a new group chat",
	tags: [TAGS.CHATS],

	request: {
		body: request.multipart({
			schema: CreateGroupChatDTO,
		}),
	},

	responses: {
		[StatusCodes.CREATED]: response.json({
			schema: z.object({
				chat: Chat,
			}),
			description: "Group chat created successfully",
		}),

		[StatusCodes.BAD_REQUEST]: errors.badRequest({
			description: "Invalid data for group chat creation",
		}),
	},
} satisfies RouteConfig;
