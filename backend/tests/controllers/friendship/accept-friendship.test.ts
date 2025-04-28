import { FriendshipControllers } from "../../../src/controllers";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";
import { mockFriendship } from "./setup";

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
