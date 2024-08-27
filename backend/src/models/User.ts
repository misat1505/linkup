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

export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.firstName === "string" &&
    typeof obj.lastName === "string" &&
    (typeof obj.photoURL === "string" || obj.photoURL === null) &&
    obj.lastActive instanceof Date
  );
}

export function isUserWithCredentials(obj: any): obj is UserWithCredentials {
  return (
    typeof obj.login === "string" &&
    typeof obj.password === "string" &&
    typeof obj.salt === "string" &&
    isUser(obj)
  );
}
