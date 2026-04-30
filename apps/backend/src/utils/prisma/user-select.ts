/**
 * Prisma select object for querying user details while excluding sensitive information.
 * This select object includes the user's ID, first name, last name, photo URL, and last active date.
 * It is designed to avoid querying sensitive fields such as login, password, and salt.
 *
 * @source
 *
 * @constant
 * @example
 * const users = await prisma.user.findMany({
 *   select: userSelect
 * });
 */
export const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  photoURL: true,
  lastActive: true,
} as const;
