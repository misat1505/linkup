import { API_URL } from "../constants";
import { User } from "../models/User";
import { USER_API } from "./utils";

export const searchUsers = async (term: string): Promise<User[]> => {
  const {
    data: { users: data }
  } = await USER_API.get(`/search?term=${term}`);

  const users = data.map(({ lastActive, photoURL, ...rest }: any) => ({
    lastActive: new Date(lastActive),
    photoURL: `${API_URL}/files/${photoURL}`,
    ...rest
  })) as User[];

  return users;
};
