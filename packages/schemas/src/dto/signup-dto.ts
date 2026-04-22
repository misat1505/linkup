import z from "zod";
import { SCHEMA_REGISTRY } from "../registry";
import { User } from "../user";
import { LoginDTO } from "./login-dto";

export const SignupDTO = LoginDTO.merge(
  User.pick({ firstName: true, lastName: true }),
)
  .extend({
    file: z.string().optional().openapi({
      type: "string",
      format: "binary",
      description: "Avatar of the user.",
    }),
  })
  .openapi(SCHEMA_REGISTRY.DTO.SIGNUP_DTO);

export type SignupDTO = z.infer<typeof SignupDTO>;
