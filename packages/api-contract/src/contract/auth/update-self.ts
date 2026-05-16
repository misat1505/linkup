import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { SignupDTO, User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const updateSelfRoute = {
	method: "put",
	path: "/auth/user",
	summary: "Update user details",
	tags: [TAGS.AUTH],

	request: {
		body: request.multipart({
			schema: SignupDTO,
		}),
	},

	responses: {
		[StatusCodes.OK]: response.json({
			schema: z.object({
				user: User,
			}),
			description: "User updated successfully",
		}),

		[StatusCodes.CONFLICT]: errors.conflict({
			description: "Login already taken",
		}),
	},
} satisfies RouteConfig;
