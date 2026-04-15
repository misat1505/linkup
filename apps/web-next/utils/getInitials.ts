import { User } from "@/features/auth/schemas/user";

export function getInitials(user: User): string {
  const initials = `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;
  return initials;
}
