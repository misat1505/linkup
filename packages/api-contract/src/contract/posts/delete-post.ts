import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { Post, SuccessMessage } from "@packages/schemas";
import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

export const deletePostRoute = {
	method: "delete",
	path: "/posts/{id}",
	summary: "Delete a post",
	tags: [TAGS.POSTS],

	request: {
		params: Post.pick({ id: true }),
	},

	responses: {
		[StatusCodes.OK]: response.json({
			schema: SuccessMessage,
			description: "Post deleted successfully",
		}),

		[StatusCodes.FORBIDDEN]: errors.forbidden({
			description: "Unauthorized access. The user is not allowed to delete this post.",
		}),

		[StatusCodes.NOT_FOUND]: errors.notFound({
			description: "Post not found",
		}),
	},
} satisfies RouteConfig;
