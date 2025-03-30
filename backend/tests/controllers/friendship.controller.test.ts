import express from "express";
import request from "supertest";
import { FriendshipService } from "../../src/services/FriendshipService";
import { createFriendship } from "../../src/controllers/friendships/createFriendship.controller";
import { acceptFriendship } from "../../src/controllers/friendships/acceptFriendship.controller";
import { getUserFriendships } from "../../src/controllers/friendships/getUserFriendships.controller";
import { deleteFriendship } from "../../src/controllers/friendships/deleteFriendship.controller";
import i18next from "../../src/i18n";
import middleware from "i18next-http-middleware";

jest.mock("../../src/services/FriendshipService");

describe("Friendship controllers", () => {
  const app = express();
  app.use(express.json());
  app.use(middleware.handle(i18next));
  app.post("/friendships", createFriendship);
  app.post("/friendships/accept", acceptFriendship);
  app.get("/friendships", getUserFriendships);
  app.delete("/friendships", deleteFriendship);

  describe("createFriendship", () => {
    it("should create a friendship successfully", async () => {
      const mockFriendship = {
        status: "PENDING",
        requester: {
          id: "3b6431d2-43a4-427d-9f28-ab9001ad4f63",
          name: "User A",
        },
        acceptor: {
          id: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
          name: "User B",
        },
      };

      (FriendshipService.createFriendship as jest.Mock).mockResolvedValue(
        mockFriendship
      );

      const response = await request(app)
        .post("/friendships")
        .send({
          token: { userId: "3b6431d2-43a4-427d-9f28-ab9001ad4f63" },
          requesterId: "3b6431d2-43a4-427d-9f28-ab9001ad4f63",
          acceptorId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ friendship: mockFriendship });
    });

    it("should fail if requesterId does not match userId", async () => {
      const response = await request(app)
        .post("/friendships")
        .send({
          token: { userId: "different-user-id" },
          requesterId: "3b6431d2-43a4-427d-9f28-ab9001ad4f63",
          acceptorId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message: "Cannot create friendship not requested by you.",
      });
    });

    it("should fail if friendship already exists", async () => {
      (FriendshipService.createFriendship as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/friendships")
        .send({
          token: { userId: "3b6431d2-43a4-427d-9f28-ab9001ad4f63" },
          requesterId: "3b6431d2-43a4-427d-9f28-ab9001ad4f63",
          acceptorId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
        });

      expect(response.statusCode).toBe(409);
      expect(response.body).toEqual({
        message: "Friendship already exists between users.",
      });
    });
  });

  describe("acceptFriendship", () => {
    it("should accept a friendship successfully", async () => {
      const mockFriendship = {
        status: "ACCEPTED",
        requester: {
          id: "3b6431d2-43a4-427d-9f28-ab9001ad4f63",
          name: "User A",
        },
        acceptor: {
          id: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
          name: "User B",
        },
      };

      (FriendshipService.acceptFriendship as jest.Mock).mockResolvedValue(
        mockFriendship
      );

      const response = await request(app)
        .post("/friendships/accept")
        .send({
          token: { userId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a" },
          requesterId: "3b6431d2-43a4-427d-9f28-ab9001ad4f63",
          acceptorId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ friendship: mockFriendship });
    });

    it("should fail if acceptorId does not match userId", async () => {
      const response = await request(app)
        .post("/friendships/accept")
        .send({
          token: { userId: "different-user-id" },
          requesterId: "3b6431d2-43a4-427d-9f28-ab9001ad4f63",
          acceptorId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message:
          "Cannot accept friendship not being meant to be accepted by you.",
      });
    });

    it("should fail if friendship does not exist", async () => {
      (FriendshipService.acceptFriendship as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/friendships/accept")
        .send({
          token: { userId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a" },
          requesterId: "3b6431d2-43a4-427d-9f28-ab9001ad4f63",
          acceptorId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
        });

      expect(response.statusCode).toBe(409);
      expect(response.body).toEqual({
        message: "Friendship between users doesn't exist.",
      });
    });
  });

  describe("getUserFriendships", () => {
    it("should fetch all friendships for the user", async () => {
      const mockFriendships = [
        {
          status: "ACCEPTED",
          requester: { id: "user-id-1", name: "User A" },
          acceptor: { id: "user-id-2", name: "User B" },
        },
      ];

      (FriendshipService.getUserFriendships as jest.Mock).mockResolvedValue(
        mockFriendships
      );

      const response = await request(app)
        .get("/friendships")
        .send({ token: { userId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a" } });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ friendships: mockFriendships });
    });
  });

  describe("deleteFriendship", () => {
    it("should delete a friendship successfully", async () => {
      (FriendshipService.deleteFriendship as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .delete("/friendships")
        .send({
          token: { userId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a" },
          requesterId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
          acceptorId: "user-id-2",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: "Friendship deleted successfully.",
      });
    });

    it("should fail if user is not part of the friendship", async () => {
      (FriendshipService.deleteFriendship as jest.Mock).mockResolvedValue(
        false
      );

      const response = await request(app)
        .delete("/friendships")
        .send({
          token: { userId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a" },
          requesterId: "user-id-1",
          acceptorId: "user-id-2",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message: "Cannot delete friendship not belonging to you.",
      });
    });

    it("should fail if the friendship does not exist", async () => {
      (FriendshipService.deleteFriendship as jest.Mock).mockResolvedValue(
        false
      );

      const response = await request(app)
        .delete("/friendships")
        .send({
          token: { userId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a" },
          requesterId: "9a2e94ad-604c-46ea-b96c-44c490d1a91a",
          acceptorId: "user-id-2",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        message: "Friendship not found.",
      });
    });
  });
});
