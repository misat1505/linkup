import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { Post } from "@packages/schemas";
import z from "zod";

import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

export const getPostRoute = {
	method: "get",
	path: "/posts/{id}",
	summary: "Get a post by its ID",
	tags: [TAGS.POSTS],

	request: {
		params: Post.pick({ id: true }),
	},

	responses: {
		[StatusCodes.OK]: response.json({
			schema: z.object({ post: Post }),
			description: "Post retrieved successfully",
		}),

		[StatusCodes.NOT_FOUND]: errors.notFound({
			description: "Post not found",
		}),
	},
} satisfies RouteConfig;
