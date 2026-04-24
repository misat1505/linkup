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

describe("acceptFriendship", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
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

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      expect.anything(),
    );
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

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CONFLICT,
      expect.anything(),
    );
  });
});
