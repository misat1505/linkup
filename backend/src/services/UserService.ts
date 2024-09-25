import { User, UserWithCredentials } from "../types/User";
import { prisma } from "../lib/Prisma";
import { userSelect } from "../utils/prisma/userSelect";

export class UserService {
  static async updateUser(user: UserWithCredentials): Promise<void> {
    const { id, ...rest } = user;

    await prisma.user.update({
      data: { ...rest },
      where: { id },
    });
  }

  static async searchUsers(term: string): Promise<User[]> {
    const users: User[] = await prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: term,
            },
          },
          {
            lastName: {
              contains: term,
            },
          },
        ],
      },
      select: userSelect,
    });

    return users;
  }

  static async isLoginTaken(
    login: UserWithCredentials["login"]
  ): Promise<boolean> {
    const user: UserWithCredentials | null = await prisma.user.findFirst({
      where: { login },
    });
    return !!user;
  }

  static async insertUser(user: UserWithCredentials): Promise<void> {
    await prisma.user.create({
      data: { ...user },
    });
  }

  static async getUserByLogin(
    login: UserWithCredentials["login"]
  ): Promise<UserWithCredentials | null> {
    const user: UserWithCredentials | null = await prisma.user.findFirst({
      where: { login },
    });
    return user;
  }

  static async getUser(
    id: UserWithCredentials["id"]
  ): Promise<UserWithCredentials | null> {
    const user: UserWithCredentials | null = await prisma.user.findFirst({
      where: { id },
    });
    return user;
  }

  static async updateLastActive(id: User["id"]): Promise<void> {
    await prisma.user.update({
      data: { lastActive: new Date() },
      where: { id },
    });
  }

  static removeCredentials(userWithCredentials: UserWithCredentials): User {
    const { login, password, salt, ...rest } = userWithCredentials;
    const user: User = { ...rest };
    return user;
  }
}
