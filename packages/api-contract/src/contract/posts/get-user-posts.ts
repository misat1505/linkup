import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { Post } from "@packages/schemas";
import z from "zod";

import { response } from "../../utils/responses";

export const getUserPostsRoute = {
	method: "get",
	path: "/posts/mine",
	summary: "Retrieve posts by the authenticated user",
	tags: [TAGS.POSTS],

	responses: {
		[StatusCodes.OK]: response.json({
			schema: z.object({ posts: z.array(Post) }),
			description: "User's posts retrieved successfully",
		}),
	},
} satisfies RouteConfig;
