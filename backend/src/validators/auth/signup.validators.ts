import { z } from "zod";
import { UserWithCredentials } from "../../types/User";

export const SignupDTO = UserWithCredentials.pick({
  firstName: true,
  lastName: true,
  login: true,
  password: true,
});

export type SignupDTO = z.infer<typeof SignupDTO>;
