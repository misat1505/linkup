import { defaultOptions } from "./utils";

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

export function isUser(obj: any, options = defaultOptions): obj is User {
  const { allowStringifiedDates } = options;

  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.firstName === "string" &&
    typeof obj.lastName === "string" &&
    (typeof obj.photoURL === "string" || obj.photoURL === null) &&
    (obj.lastActive instanceof Date ||
      (allowStringifiedDates &&
        typeof obj.lastActive === "string" &&
        !isNaN(Date.parse(obj.lastActive))))
  );
}

export function isUserWithCredentials(
  obj: any,
  options = defaultOptions
): obj is UserWithCredentials {
  return (
    typeof obj.login === "string" &&
    typeof obj.password === "string" &&
    typeof obj.salt === "string" &&
    isUser(obj, options)
  );
}
