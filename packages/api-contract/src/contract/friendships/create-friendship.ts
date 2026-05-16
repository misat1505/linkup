import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CreateFriendshipDTO, Friendship } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import z from "zod";
import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const createFriendshipRoute = {
	method: "post",
	path: "/friendships",
	summary: "Create a new friendship request",
	tags: [TAGS.FRIENDSHIPS],

	request: {
		body: request.json({
			schema: CreateFriendshipDTO,
		}),
	},

	responses: {
		[StatusCodes.CREATED]: response.json({
			schema: z.object({ friendship: Friendship }),
			description: "Friendship request created successfully",
		}),

		[StatusCodes.BAD_REQUEST]: errors.badRequest({
			description: "Invalid requester or malformed friendship request",
		}),

		[StatusCodes.CONFLICT]: errors.conflict({
			description: "Friendship already exists or is pending",
		}),
	},
} satisfies RouteConfig;
