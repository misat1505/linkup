import { z } from "zod";
import { UserWithCredentials } from "@/types/User";

export const LoginDTO = UserWithCredentials.pick({
  login: true,
  password: true,
}).strict();

export type LoginDTO = z.infer<typeof LoginDTO>;
