import { StatusCodes } from "http-status-codes";
import { FriendshipControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "@tests/utils/mocks";
import { mockFriendship } from "./setup";

describe("getUserFriendships", () => {
  it("retrieves all user friendships", async () => {
    const mockFriendships = [
      {
        status: "ACCEPTED",
        requester: { id: "user-id-1", name: "User A" },
        acceptor: { id: "user-id-2", name: "User B" },
      },
    ];

    mockFriendshipService.getUserFriendships.mockResolvedValue(mockFriendships);

    const req = mockRequest({
      user: { id: mockFriendship.requester.id } as UserWithCredentials,
    });
    const res = mockResponse();

    await FriendshipControllers.getUserFriendships(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });
});
