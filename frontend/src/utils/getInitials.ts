import { User } from "../models/User";

type getInitialsArgs = {
  firstName: User["firstName"];
  lastName: User["lastName"];
};

export function getInitials({ firstName, lastName }: getInitialsArgs): string {
  const initials = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  return initials;
}
