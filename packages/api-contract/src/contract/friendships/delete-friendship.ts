import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { DeleteFriendshipDTO, SuccessMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const deleteFriendshipRoute = {
	method: "delete",
	path: "/friendships",
	summary: "Delete an existing friendship",
	tags: [TAGS.FRIENDSHIPS],

	request: {
		body: request.json({
			schema: DeleteFriendshipDTO,
		}),
	},

	responses: {
		[StatusCodes.OK]: response.json({
			schema: SuccessMessage,
			description: "Friendship deleted successfully",
		}),

		[StatusCodes.NOT_FOUND]: errors.notFound({
			description: "Friendship does not exist",
		}),

		[StatusCodes.FORBIDDEN]: errors.forbidden({
			description: "User not authorized to delete this friendship",
		}),
	},
} satisfies RouteConfig;
