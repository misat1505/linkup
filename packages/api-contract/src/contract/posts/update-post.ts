import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { Post, UpdatePostDTO } from "@packages/schemas";
import z from "zod";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const updatePostRoute = {
	method: "put",
	path: "/posts/{id}",
	summary: "Update an existing post by ID",
	tags: [TAGS.POSTS],

	request: {
		params: Post.pick({ id: true }),
		body: request.json({
			schema: UpdatePostDTO,
			description: "Post update payload",
		}),
	},

	responses: {
		[StatusCodes.OK]: response.json({
			schema: z.object({ post: Post }),
			description: "Post updated successfully",
		}),

		[StatusCodes.FORBIDDEN]: errors.forbidden({
			description: "User is not allowed to edit this post",
		}),

		[StatusCodes.NOT_FOUND]: errors.notFound({
			description: "Post not found",
		}),
	},
} satisfies RouteConfig;
