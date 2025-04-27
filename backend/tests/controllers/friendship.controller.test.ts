import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "../utils/mocks";
import { FriendshipControllers } from "../../src/controllers";

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

describe("Friendship controllers", () => {
  describe("createFriendship", () => {
    it("should create a friendship successfully", async () => {
      mockFriendshipService.createFriendship.mockResolvedValue(mockFriendship);

      const req = mockRequest({
        body: {
          token: { userId: mockFriendship.requester.id },
          requesterId: mockFriendship.requester.id,
          acceptorId: mockFriendship.acceptor.id,
        },
      });
      const res = mockResponse();

      await FriendshipControllers.createFriendship(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should fail if requesterId does not match userId", async () => {
      mockFriendshipService.createFriendship.mockResolvedValue(mockFriendship);

      const req = mockRequest({
        body: {
          token: { userId: "different-user-id" },
          requesterId: mockFriendship.requester.id,
          acceptorId: mockFriendship.acceptor.id,
        },
      });
      const res = mockResponse();

      await FriendshipControllers.createFriendship(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail if friendship already exists", async () => {
      mockFriendshipService.createFriendship.mockResolvedValue(null);

      const req = mockRequest({
        body: {
          token: { userId: mockFriendship.requester.id },
          requesterId: mockFriendship.requester.id,
          acceptorId: mockFriendship.acceptor.id,
        },
      });
      const res = mockResponse();

      await FriendshipControllers.createFriendship(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe("acceptFriendship", () => {
    it("should accept a friendship successfully", async () => {
      mockFriendshipService.acceptFriendship.mockResolvedValue(mockFriendship);

      const req = mockRequest({
        body: {
          token: { userId: mockFriendship.requester.id },
          requesterId: mockFriendship.acceptor.id,
          acceptorId: mockFriendship.requester.id,
        },
      });
      const res = mockResponse();

      await FriendshipControllers.acceptFriendship(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should fail if acceptorId does not match userId", async () => {
      const req = mockRequest({
        body: {
          token: { userId: "different-user-id" },
          requesterId: mockFriendship.requester.id,
          acceptorId: mockFriendship.acceptor.id,
        },
      });
      const res = mockResponse();

      await FriendshipControllers.acceptFriendship(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail if friendship does not exist", async () => {
      mockFriendshipService.acceptFriendship.mockResolvedValue(null);

      const req = mockRequest({
        body: {
          token: { userId: mockFriendship.requester.id },
          requesterId: mockFriendship.acceptor.id,
          acceptorId: mockFriendship.requester.id,
        },
      });
      const res = mockResponse();

      await FriendshipControllers.acceptFriendship(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(409);
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

      mockFriendshipService.getUserFriendships.mockResolvedValue(
        mockFriendships
      );

      const req = mockRequest({
        body: {
          token: { userId: mockFriendship.requester.id },
        },
      });
      const res = mockResponse();

      await FriendshipControllers.getUserFriendships(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteFriendship", () => {
    it("should delete a friendship successfully", async () => {
      mockFriendshipService.deleteFriendship.mockResolvedValue(true);

      const req = mockRequest({
        body: {
          token: { userId: mockFriendship.acceptor.id },
          requesterId: mockFriendship.acceptor.id,
          acceptorId: "user-id-2",
        },
      });
      const res = mockResponse();

      await FriendshipControllers.deleteFriendship(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should fail if user is not part of the friendship", async () => {
      mockFriendshipService.deleteFriendship.mockResolvedValue(false);

      const req = mockRequest({
        body: {
          token: { userId: mockFriendship.acceptor.id },
          requesterId: "user-id-1",
          acceptorId: "user-id-2",
        },
      });
      const res = mockResponse();

      await FriendshipControllers.deleteFriendship(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail if the friendship does not exist", async () => {
      mockFriendshipService.deleteFriendship.mockResolvedValue(false);

      const req = mockRequest({
        body: {
          token: { userId: mockFriendship.acceptor.id },
          requesterId: mockFriendship.acceptor.id,
          acceptorId: "user-id-2",
        },
      });
      const res = mockResponse();

      await FriendshipControllers.deleteFriendship(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
