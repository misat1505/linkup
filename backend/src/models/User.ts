export type User = {
  id: string;
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  photoURL: string | null;
};

export type FrontendUser = Omit<User, "login" | "password">;
