import { LoginFormType } from "@/validators/auth.validators";
import { User } from "../models/User";
import { AUTH_API } from "./utils";

export const fetchUser = async (): Promise<User> => {
  const { data } = await AUTH_API.get("/user");
  return data.user;
};

export const loginUser = async (data: LoginFormType): Promise<void> => {
  await AUTH_API.post("/login", data);
};
