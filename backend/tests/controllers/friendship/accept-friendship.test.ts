import { FriendshipControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";
import { mockFriendship } from "./setup";

describe("acceptFriendship", () => {
  it("accepts friendship successfully", async () => {
    mockFriendshipService.acceptFriendship.mockResolvedValue(mockFriendship);

    const req = mockRequest({
      user: { id: mockFriendship.requester.id } as UserWithCredentials,
      validated: {
        body: {
          requesterId: mockFriendship.acceptor.id,
          acceptorId: mockFriendship.requester.id,
        },
      },
    });
    const res = mockResponse();

    await FriendshipControllers.acceptFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("fails for mismatched acceptorId", async () => {
    const req = mockRequest({
      user: { id: "different-user-id" } as UserWithCredentials,
      validated: {
        body: {
          requesterId: mockFriendship.requester.id,
          acceptorId: mockFriendship.acceptor.id,
        },
      },
    });
    const res = mockResponse();

    await FriendshipControllers.acceptFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("fails for non-existent friendship", async () => {
    mockFriendshipService.acceptFriendship.mockResolvedValue(null);

    const req = mockRequest({
      user: { id: mockFriendship.requester.id } as UserWithCredentials,
      validated: {
        body: {
          requesterId: mockFriendship.acceptor.id,
          acceptorId: mockFriendship.requester.id,
        },
      },
    });
    const res = mockResponse();

    await FriendshipControllers.acceptFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });
});
