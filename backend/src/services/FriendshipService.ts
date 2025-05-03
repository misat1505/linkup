import { Friendship } from "../types/Friendship";
import { PrismaClientOrTransaction } from "../types/Prisma";
import { User } from "../types/User";
import { userSelect } from "../utils/prisma/userSelect";

/**
 * Service class responsible for managing friendship-related operations in the database using Prisma.
 */
export class FriendshipService {
  private prisma: PrismaClientOrTransaction;

  constructor(prisma: PrismaClientOrTransaction) {
    this.prisma = prisma;
  }
  /**
   * Retrieves a user's friendships.
   * @param userId - The ID of the user whose friendships are to be retrieved.
   * @returns A list of friendships associated with the user.
   */
  async getUserFriendships(userId: User["id"]): Promise<Friendship[]> {
    const friendships: Friendship[] = await this.prisma.friend.findMany({
      where: {
        OR: [{ requesterId: userId }, { acceptorId: userId }],
      },
      include: {
        requester: { select: userSelect },
        acceptor: { select: userSelect },
      },
    });

    return friendships.map((f) => Friendship.parse(f)!);
  }

  /**
   * Creates a new friendship request.
   * @param requesterId - The ID of the user sending the friend request.
   * @param acceptorId - The ID of the user receiving the friend request.
   * @returns The created friendship object, or `null` if the friendship already exists.
   */
  async createFriendship(
    requesterId: User["id"],
    acceptorId: User["id"]
  ): Promise<Friendship | null> {
    const existingFriendship = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { requesterId, acceptorId },
          { requesterId: acceptorId, acceptorId: requesterId },
        ],
      },
    });

    if (existingFriendship) return null;

    const newFriendship: Friendship = await this.prisma.friend.create({
      data: {
        requesterId,
        acceptorId,
        status: "PENDING",
      },
      include: {
        requester: { select: userSelect },
        acceptor: { select: userSelect },
      },
    });

    return Friendship.parse(newFriendship);
  }

  /**
   * Accepts a friendship request.
   * @param requesterId - The ID of the user who sent the friend request.
   * @param acceptorId - The ID of the user accepting the friend request.
   * @returns The updated friendship object, or `null` if no pending friendship exists.
   */
  async acceptFriendship(
    requesterId: User["id"],
    acceptorId: User["id"]
  ): Promise<Friendship | null> {
    const friendship = await this.prisma.friend.findFirst({
      where: {
        requesterId,
        acceptorId,
        status: "PENDING",
      },
    });

    if (!friendship) return null;

    const updatedFriendship: Friendship = await this.prisma.friend.update({
      where: {
        requesterId_acceptorId: {
          requesterId,
          acceptorId,
        },
      },
      data: {
        status: "ACCEPTED",
      },
      include: {
        requester: { select: userSelect },
        acceptor: { select: userSelect },
      },
    });

    return Friendship.parse(updatedFriendship);
  }

  /**
   * Deletes a friendship.
   * @param requesterId - The ID of the user who sent the friend request.
   * @param acceptorId - The ID of the user accepting or rejecting the friendship.
   * @returns `true` if the friendship was successfully deleted, otherwise `false`.
   */
  async deleteFriendship(
    requesterId: User["id"],
    acceptorId: User["id"]
  ): Promise<boolean> {
    const deletedCount = await this.prisma.friend.deleteMany({
      where: {
        OR: [
          { requesterId, acceptorId },
          { requesterId: acceptorId, acceptorId: requesterId },
        ],
      },
    });

    return deletedCount.count > 0;
  }
}
