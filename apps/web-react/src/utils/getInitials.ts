import { User } from "@/types/User";

export function getInitials(user: User): string {
  const initials = `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;
  return initials;
}
