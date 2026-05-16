import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { SignupDTO, User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const signupRoute = {
	method: "post",
	path: "/auth/signup",
	summary: "Sign up a new user",
	tags: [TAGS.AUTH],

	request: {
		body: request.multipart({
			schema: SignupDTO,
		}),
	},

	responses: {
		[StatusCodes.CREATED]: response.json({
			schema: z.object({
				user: User,
				accessToken: z.string(),
			}),
			description: "User created successfully",
		}),

		[StatusCodes.CONFLICT]: errors.conflict({
			description: "Login already taken",
		}),
	},
} satisfies RouteConfig;
