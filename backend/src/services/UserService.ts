import { User, UserWithCredentials } from "../models/User";
import { prisma } from "../lib/Prisma";

export class UserService {
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
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photoURL: true,
        lastActive: true,
      },
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
