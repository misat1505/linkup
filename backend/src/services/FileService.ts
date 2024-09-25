import { prisma } from "../lib/Prisma";
import { User } from "../types/User";

export class FileService {
  static async isUserAvatar(photoURL: string): Promise<boolean> {
    const result = await prisma.user.findFirst({
      where: { photoURL },
    });

    return !!result;
  }

  static async isChatPhoto(
    photoURL: string,
    userId: User["id"]
  ): Promise<boolean> {
    const result = await prisma.chat.findFirst({
      where: {
        photoURL,
        type: { in: ["GROUP", "PRIVATE"] },
        users: {
          some: { userId },
        },
      },
    });

    return !!result;
  }

  static async isChatMessage(
    photoURL: string,
    userId: User["id"]
  ): Promise<boolean> {
    const result = await prisma.chat.findFirst({
      where: {
        type: { in: ["GROUP", "PRIVATE"] },
        users: {
          some: { userId },
        },
        messages: {
          some: {
            files: {
              some: {
                url: photoURL,
              },
            },
          },
        },
      },
    });

    return !!result;
  }
}
