import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Chat, CreatePrivateChatDTO } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const createPrivateChatRoute = {
	method: "post",
	path: "/chats/private",
	summary: "Create a new private chat",
	tags: [TAGS.CHATS],

	request: {
		body: request.json({
			schema: CreatePrivateChatDTO,
		}),
	},

	responses: {
		[StatusCodes.CREATED]: response.json({
			schema: z.object({
				chat: Chat,
			}),
			description: "Private chat created successfully",
		}),

		[StatusCodes.CONFLICT]: response.json({
			schema: z.object({
				chat: Chat,
			}),
			description: "Chat already exists",
		}),

		[StatusCodes.BAD_REQUEST]: errors.badRequest({
			description: "Invalid request or users cannot create chat",
		}),
	},
} satisfies RouteConfig;
