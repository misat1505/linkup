import { User } from "@/features/auth/schemas/user";

export function createFullName(user: User, maxLength = Infinity): string {
  const fullName = `${user.firstName} ${user.lastName}`;
  if (user.firstName.length + user.lastName.length > maxLength) {
    return `${fullName.substring(0, maxLength)}...`;
  }
  return fullName;
}
