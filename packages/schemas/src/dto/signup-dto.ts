import z from "zod";
import { User } from "../user";
import { LoginDTO } from "./login-dto";

export const SignupDTO = LoginDTO.merge(
  User.pick({ firstName: true, lastName: true }),
).extend({
  file: z.any().optional(),
});

export type SignupDTO = z.infer<typeof SignupDTO>;
