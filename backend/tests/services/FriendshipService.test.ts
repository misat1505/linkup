import { FriendshipService } from "../../src/services/FriendshipService";
import { isFriendship } from "../../src/types/guards/friendship.guard";
import { USER } from "../utils/constants";

describe("FriendshipService", () => {
  const user2Id = "935719fa-05c4-42c4-9b02-2be3fefb6e61";

  describe("getUserFriendships", () => {
    it("should return an empty list when no friendships exist", async () => {
      const result = await FriendshipService.getUserFriendships(USER.id);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it("should return friendships for a user", async () => {
      await FriendshipService.createFriendship(USER.id, user2Id);

      const result = await FriendshipService.getUserFriendships(USER.id);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0].requester.id).toBe(USER.id);
      expect(result[0].acceptor.id).toBe(user2Id);
      expect(result[0].status).toBe("PENDING");
      expect(isFriendship(result[0])).toBe(true);
    });
  });

  describe("createFriendship", () => {
    it("should create a new friendship", async () => {
      const result = await FriendshipService.createFriendship(USER.id, user2Id);

      expect(result).not.toBeNull();
      expect(result!.requester.id).toBe(USER.id);
      expect(result!.acceptor.id).toBe(user2Id);
      expect(result!.status).toBe("PENDING");
      expect(isFriendship(result)).toBe(true);
    });

    it("should return null if the friendship already exists", async () => {
      await FriendshipService.createFriendship(USER.id, user2Id);
      const result = await FriendshipService.createFriendship(USER.id, user2Id);
      expect(result).toBeNull();
    });
  });

  describe("acceptFriendship", () => {
    it("should accept a pending friendship", async () => {
      await FriendshipService.createFriendship(USER.id, user2Id);
      const result = await FriendshipService.acceptFriendship(USER.id, user2Id);

      expect(result).not.toBeNull();
      expect(result!.requester.id).toBe(USER.id);
      expect(result!.acceptor.id).toBe(user2Id);
      expect(result!.status).toBe("ACCEPTED");
      expect(isFriendship(result)).toBe(true);
    });

    it("should return null if there is no pending friendship", async () => {
      const result = await FriendshipService.acceptFriendship(USER.id, user2Id);
      expect(result).toBeNull();
    });
  });

  describe("deleteFriendship", () => {
    it("should delete an existing friendship", async () => {
      await FriendshipService.createFriendship(USER.id, user2Id);
      const result = await FriendshipService.deleteFriendship(USER.id, user2Id);

      expect(result).toBe(true);

      const friendships = await FriendshipService.getUserFriendships(USER.id);
      expect(friendships.length).toBe(0);
    });

    it("should return false if the friendship does not exist", async () => {
      const result = await FriendshipService.deleteFriendship(USER.id, user2Id);
      expect(result).toBe(false);
    });
  });
});
