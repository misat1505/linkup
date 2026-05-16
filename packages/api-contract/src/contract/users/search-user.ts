import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { SearchUserQuery, User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

export const searchUserRoute = {
	method: "get",
	path: "/users/search",
	summary: "Search users by term",
	description: "Search for users based on a search term.",
	tags: [TAGS.USERS],

	request: {
		query: SearchUserQuery,
	},

	responses: {
		[StatusCodes.OK]: response.json({
			schema: z.object({
				users: z.array(User),
			}),
			description: "A list of users matching the search term",
		}),

		[StatusCodes.BAD_REQUEST]: errors.badRequest({
			description: "Missing or invalid search query parameter",
		}),
	},
} satisfies RouteConfig;
