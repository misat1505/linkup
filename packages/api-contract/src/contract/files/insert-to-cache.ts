import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { InsertToCacheDTO } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const insertToCacheRoute = {
	method: "post",
	path: "/files/cache",
	summary: "Upload a file to the user's cache",
	tags: [TAGS.FILES],

	request: {
		body: request.multipart({
			schema: InsertToCacheDTO,
		}),
	},

	responses: {
		[StatusCodes.CREATED]: response.json({
			schema: z.object({
				file: z.string(),
			}),
			description: "File uploaded successfully",
		}),

		[StatusCodes.BAD_REQUEST]: errors.badRequest({
			description: "Cache limit reached or no file provided",
		}),
	},
} satisfies RouteConfig;
