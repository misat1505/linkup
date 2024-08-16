import { User } from "../models/User";

export function createFullName(
  firstName: User["firstName"],
  lastName: User["lastName"],
  maxLength = 15
): string {
  const fullName = `${firstName} ${lastName}`;
  if (firstName.length + lastName.length > maxLength) {
    return `${fullName.substring(0, maxLength)}...`;
  }
  return fullName;
}
