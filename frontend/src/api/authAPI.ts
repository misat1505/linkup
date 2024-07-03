import { User } from "../models/User";
import { AUTH_API } from "./utils";

export const fetchUser = async (): Promise<User> => {
  const { data } = await AUTH_API.get("/user");
  return data.user;
};
