import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { response } from "../../utils/responses";

export const getCacheRoute = {
	method: "get",
	path: "/files/cache",
	summary: "Retrieve a list of files from the user's cache",
	tags: [TAGS.FILES],

	responses: {
		[StatusCodes.OK]: response.json({
			schema: z.object({
				files: z.array(z.string()),
			}),
			description: "Files in the cache listed successfully",
		}),
	},
} satisfies RouteConfig;
