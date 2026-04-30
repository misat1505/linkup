import { UserWithCredentials } from "@/types/user-with-credentials";
import { z } from "zod";

export const LoginDTO = UserWithCredentials.pick({
  login: true,
  password: true,
}).strict();

export type LoginDTO = z.infer<typeof LoginDTO>;
