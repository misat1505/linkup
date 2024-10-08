export type User = {
  id: string;
  firstName: string;
  lastName: string;
  photoURL: string | null;
  lastActive: Date;
};

export type UserWithCredentials = User & {
  login: string;
  password: string;
  salt: string;
};
