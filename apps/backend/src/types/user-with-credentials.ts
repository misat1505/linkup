import { LOGIN_VALIDATION, User } from "@packages/schemas";
import { z } from "zod";

export const UserWithCredentials = User.extend({
	login: z.string().min(LOGIN_VALIDATION.login.min).max(LOGIN_VALIDATION.login.max),
	password: z.string().min(LOGIN_VALIDATION.password.min),
	salt: z.string(),
});

export type UserWithCredentials = z.infer<typeof UserWithCredentials>;
