import { prisma } from "../lib/Prisma";
import { User } from "../types/User";

/**
 * Service class responsible for managing file-related operations in the database using Prisma.
 */
export class FileService {
  /**
   * Checks if a photo URL is associated with a user's avatar.
   * @param photoURL - The URL of the photo to check.
   * @returns `true` if the photo URL matches a user's avatar, otherwise `false`.
   */
  static async isUserAvatar(photoURL: string): Promise<boolean> {
    const result = await prisma.user.findFirst({
      where: { photoURL },
    });

    return !!result;
  }

  /**
   * Checks if a photo URL is associated with a chat's photo.
   * @param photoURL - The URL of the photo to check.
   * @param userId - The ID of the user to check the association for.
   * @returns `true` if the photo URL is associated with a chat's photo, otherwise `false`.
   */
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

  /**
   * Checks if a photo URL is associated with any message in a chat.
   * @param photoURL - The URL of the photo to check.
   * @param userId - The ID of the user to check the association for.
   * @returns `true` if the photo URL is associated with a chat message, otherwise `false`.
   */
  static async isChatMessage(
    photoURL: string,
    userId: User["id"]
  ): Promise<boolean> {
    const postChat = await prisma.chat.findFirst({
      where: {
        type: "POST",
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

    if (postChat) return true;

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
