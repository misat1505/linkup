import { User, UserWithCredentials } from "../types/User";
import { prisma } from "../lib/Prisma";
import { userSelect } from "../utils/prisma/userSelect";

/**
 * Service class responsible for managing user-related operations in the database using Prisma.
 */
export class UserService {
  /**
   * Updates the user data in the database.
   * @param user - The user object containing updated data.
   */
  static async updateUser(user: UserWithCredentials): Promise<void> {
    const { id, ...rest } = user;

    await prisma.user.update({
      data: { ...rest },
      where: { id },
    });
  }

  /**
   * Searches for users based on a search term. The term is matched against first and last names.
   * @param term - The search term to use for matching users.
   * @returns A list of users matching the search criteria.
   */
  static async searchUsers(term: string): Promise<User[]> {
    const searchTerms = term.trim().toLowerCase().split(/\s+/);

    const users: User[] = await prisma.user.findMany({
      where: {
        OR: searchTerms.map((term) => ({
          OR: [
            {
              firstName: {
                contains: term,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: term,
                mode: "insensitive",
              },
            },
          ],
        })),
      },
      select: userSelect,
    });

    return users;
  }

  /**
   * Checks if the provided login is already taken by another user.
   * @param login - The login to check.
   * @returns `true` if the login is taken, otherwise `false`.
   */
  static async isLoginTaken(
    login: UserWithCredentials["login"]
  ): Promise<boolean> {
    const user: UserWithCredentials | null = await prisma.user.findFirst({
      where: { login },
    });
    return !!user;
  }

  /**
   * Inserts a new user into the database.
   * @param user - The user object to insert.
   */
  static async insertUser(user: UserWithCredentials): Promise<void> {
    await prisma.user.create({
      data: { ...user },
    });
  }

  /**
   * Retrieves a user by their login.
   * @param login - The login of the user to retrieve.
   * @returns The user object, or `null` if the user is not found.
   */
  static async getUserByLogin(
    login: UserWithCredentials["login"]
  ): Promise<UserWithCredentials | null> {
    const user: UserWithCredentials | null = await prisma.user.findFirst({
      where: { login },
    });
    return user;
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user object, or `null` if the user is not found.
   */
  static async getUser(
    id: UserWithCredentials["id"]
  ): Promise<UserWithCredentials | null> {
    const user: UserWithCredentials | null = await prisma.user.findFirst({
      where: { id },
    });
    return user;
  }

  /**
   * Updates the last active timestamp for a user.
   * @param id - The ID of the user to update.
   */
  static async updateLastActive(id: User["id"]): Promise<void> {
    await prisma.user.update({
      data: { lastActive: new Date() },
      where: { id },
    });
  }

  /**
   * Removes sensitive credential data from a user object.
   * @param userWithCredentials - The user object with credentials.
   * @returns The user object without login, password, or salt.
   */
  static removeCredentials(userWithCredentials: UserWithCredentials): User {
    const { login, password, salt, ...rest } = userWithCredentials;
    const user: User = { ...rest };
    return user;
  }
}
