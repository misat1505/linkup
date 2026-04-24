import { FriendshipControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { mockFriendship } from "./setup";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("getUserFriendships", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
  });
});
