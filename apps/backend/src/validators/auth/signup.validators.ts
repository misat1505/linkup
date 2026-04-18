import { UserWithCredentials } from "@/types/UserWithCredentials";
import { z } from "zod";

export const SignupDTO = UserWithCredentials.pick({
  firstName: true,
  lastName: true,
  login: true,
  password: true,
});

export type SignupDTO = z.infer<typeof SignupDTO>;
