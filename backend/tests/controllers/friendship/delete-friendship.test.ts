import { StatusCodes } from "http-status-codes";
import { FriendshipControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";
import { mockFriendship } from "./setup";

describe("deleteFriendship", () => {
  it("deletes friendship successfully", async () => {
    mockFriendshipService.deleteFriendship.mockResolvedValue(true);

    const req = mockRequest({
      user: { id: mockFriendship.acceptor.id } as UserWithCredentials,
      validated: {
        body: {
          requesterId: mockFriendship.acceptor.id,
          acceptorId: "user-id-2",
        },
      },
    });
    const res = mockResponse();

    await FriendshipControllers.deleteFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it("fails for non-participant user", async () => {
    mockFriendshipService.deleteFriendship.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: mockFriendship.acceptor.id } as UserWithCredentials,
      validated: {
        body: {
          requesterId: "user-id-1",
          acceptorId: "user-id-2",
        },
      },
    });
    const res = mockResponse();

    await FriendshipControllers.deleteFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  });

  it("fails for non-existent friendship", async () => {
    mockFriendshipService.deleteFriendship.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: mockFriendship.acceptor.id } as UserWithCredentials,
      validated: {
        body: {
          requesterId: mockFriendship.acceptor.id,
          acceptorId: "user-id-2",
        },
      },
    });
    const res = mockResponse();

    await FriendshipControllers.deleteFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });
});
