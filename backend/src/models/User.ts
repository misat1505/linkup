export type User = {
  id: string;
  firstName: string;
  lastName: string;
  photoURL: string | null;
};

export type UserWithCredentials = User & {
  login: string;
  password: string;
};
