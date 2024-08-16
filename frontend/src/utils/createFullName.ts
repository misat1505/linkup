import { User } from "../models/User";

type createFullNameArgs = {
  firstName: User["firstName"];
  lastName: User["lastName"];
  maxLength?: number;
};

export function createFullName({
  firstName,
  lastName,
  maxLength = Infinity
}: createFullNameArgs): string {
  const fullName = `${firstName} ${lastName}`;
  if (firstName.length + lastName.length > maxLength) {
    return `${fullName.substring(0, maxLength)}...`;
  }
  return fullName;
}
