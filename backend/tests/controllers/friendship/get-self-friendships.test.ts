import { FriendshipControllers } from "../../../src/controllers";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";
import { mockFriendship } from "./setup";

describe("getUserFriendships", () => {
  it("should fetch all friendships for the user", async () => {
    const mockFriendships = [
      {
        status: "ACCEPTED",
        requester: { id: "user-id-1", name: "User A" },
        acceptor: { id: "user-id-2", name: "User B" },
      },
    ];

    mockFriendshipService.getUserFriendships.mockResolvedValue(mockFriendships);

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
