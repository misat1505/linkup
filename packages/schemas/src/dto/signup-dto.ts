import z from "zod";
import { SCHEMA_REGISTRY } from "../registry";
import { User, USER_VALIDATION } from "../user";
import { LOGIN_VALIDATION, LoginDTO } from "./login-dto";

export const SIGNUP_VALIDATION = {
	...LOGIN_VALIDATION,
	firstName: USER_VALIDATION.firstName,
	lastName: USER_VALIDATION.lastName,
} as const;

export const SignupDTO = LoginDTO.merge(User.pick({ firstName: true, lastName: true }))
	.extend({
		file: z.string().optional().openapi({
			type: "string",
			format: "binary",
			description: "Avatar of the user.",
		}),
	})
	.openapi(SCHEMA_REGISTRY.DTO.SIGNUP_DTO);

export type SignupDTO = z.infer<typeof SignupDTO>;
