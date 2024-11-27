import { prisma } from "../lib/Prisma";
import { Friendship } from "../types/Friendship";
import { User } from "../types/User";
import { userSelect } from "../utils/prisma/userSelect";

export class FriendshipService {
  static async getUserFriendships(userId: User["id"]): Promise<Friendship[]> {
    const friendships: Friendship[] = await prisma.friend.findMany({
      where: {
        OR: [{ requesterId: userId }, { acceptorId: userId }],
      },
      include: {
        requester: { select: userSelect },
        acceptor: { select: userSelect },
      },
    });

    return friendships;
  }

  static async createFriendship(
    requesterId: User["id"],
    acceptorId: User["id"]
  ): Promise<Friendship | null> {
    const existingFriendship = await prisma.friend.findFirst({
      where: {
        OR: [
          { requesterId, acceptorId },
          { requesterId: acceptorId, acceptorId: requesterId },
        ],
      },
    });

    if (existingFriendship) return null;

    const newFriendship: Friendship = await prisma.friend.create({
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

    return newFriendship;
  }

  static async acceptFriendship(
    requesterId: User["id"],
    acceptorId: User["id"]
  ): Promise<Friendship | null> {
    const friendship = await prisma.friend.findFirst({
      where: {
        requesterId,
        acceptorId,
        status: "PENDING",
      },
    });

    if (!friendship) return null;

    const updatedFriendship: Friendship = await prisma.friend.update({
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

    return updatedFriendship;
  }
}
