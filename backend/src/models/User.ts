import { defaultOptions, hasOnlyKeys } from "./utils";

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

const userAllowedKeys = [
  "id",
  "firstName",
  "lastName",
  "photoURL",
  "lastActive",
];
const userWithCredentialsAllowedKeys = [
  ...userAllowedKeys,
  "login",
  "password",
  "salt",
];

export function isUser(obj: any, options = defaultOptions): obj is User {
  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, userAllowedKeys) &&
    typeof obj.id === "string" &&
    typeof obj.firstName === "string" &&
    typeof obj.lastName === "string" &&
    (typeof obj.photoURL === "string" || obj.photoURL === null) &&
    (obj.lastActive instanceof Date ||
      (options.allowStringifiedDates &&
        typeof obj.lastActive === "string" &&
        !isNaN(Date.parse(obj.lastActive))))
  );
}

export function isUserWithCredentials(
  obj: any,
  options = defaultOptions
): obj is UserWithCredentials {
  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, userWithCredentialsAllowedKeys) &&
    typeof obj.id === "string" &&
    typeof obj.firstName === "string" &&
    typeof obj.lastName === "string" &&
    (typeof obj.photoURL === "string" || obj.photoURL === null) &&
    (obj.lastActive instanceof Date ||
      (options.allowStringifiedDates &&
        typeof obj.lastActive === "string" &&
        !isNaN(Date.parse(obj.lastActive)))) &&
    typeof obj.login === "string" &&
    typeof obj.password === "string" &&
    typeof obj.salt === "string"
  );
}
