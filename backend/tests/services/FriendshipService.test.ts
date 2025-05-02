import { FriendshipService } from "../../src/services/FriendshipService";
import { Friendship } from "../../src/types/Friendship";
import { testWithTransaction } from "../utils/testWithTransaction";

describe("FriendshipService", () => {
  describe("getUserFriendships", () => {
    it("should return an empty list when no friendships exist", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const friendshipService = new FriendshipService(tx);
        const result = await friendshipService.getUserFriendships(
          seed.users[0].id
        );
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(0);
      });
    });

    it("should return friendships for a user", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const friendshipService = new FriendshipService(tx);
        await friendshipService.createFriendship(
          seed.users[0].id,
          seed.users[1].id
        );

        const result = await friendshipService.getUserFriendships(
          seed.users[0].id
        );
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0].requester.id).toBe(seed.users[0].id);
        expect(result[0].acceptor.id).toBe(seed.users[1].id);
        expect(result[0].status).toBe("PENDING");
        Friendship.strict().parse(result[0]);
      });
    });
  });

  describe("createFriendship", () => {
    it("should create a new friendship", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const friendshipService = new FriendshipService(tx);
        const result = await friendshipService.createFriendship(
          seed.users[0].id,
          seed.users[1].id
        );

        expect(result).not.toBeNull();
        expect(result!.requester.id).toBe(seed.users[0].id);
        expect(result!.acceptor.id).toBe(seed.users[1].id);
        expect(result!.status).toBe("PENDING");
        Friendship.strict().parse(result);
      });
    });

    it("should return null if the friendship already exists", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const friendshipService = new FriendshipService(tx);
        await friendshipService.createFriendship(
          seed.users[0].id,
          seed.users[1].id
        );
        const result = await friendshipService.createFriendship(
          seed.users[0].id,
          seed.users[1].id
        );
        expect(result).toBeNull();
      });
    });
  });

  describe("acceptFriendship", () => {
    it("should accept a pending friendship", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const friendshipService = new FriendshipService(tx);
        await friendshipService.createFriendship(
          seed.users[0].id,
          seed.users[1].id
        );
        const result = await friendshipService.acceptFriendship(
          seed.users[0].id,
          seed.users[1].id
        );

        expect(result).not.toBeNull();
        expect(result!.requester.id).toBe(seed.users[0].id);
        expect(result!.acceptor.id).toBe(seed.users[1].id);
        expect(result!.status).toBe("ACCEPTED");
        Friendship.strict().parse(result);
      });
    });

    it("should return null if there is no pending friendship", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const friendshipService = new FriendshipService(tx);
        const result = await friendshipService.acceptFriendship(
          seed.users[0].id,
          seed.users[1].id
        );
        expect(result).toBeNull();
      });
    });
  });

  describe("deleteFriendship", () => {
    it("should delete an existing friendship", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const friendshipService = new FriendshipService(tx);
        await friendshipService.createFriendship(
          seed.users[0].id,
          seed.users[1].id
        );
        const result = await friendshipService.deleteFriendship(
          seed.users[0].id,
          seed.users[1].id
        );

        expect(result).toBeTruthy();

        const friendships = await friendshipService.getUserFriendships(
          seed.users[0].id
        );
        expect(friendships.length).toBe(0);
      });
    });

    it("should return false if the friendship does not exist", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const friendshipService = new FriendshipService(tx);
        const result = await friendshipService.deleteFriendship(
          seed.users[0].id,
          seed.users[1].id
        );
        expect(result).toBeFalsy();
      });
    });
  });
});
