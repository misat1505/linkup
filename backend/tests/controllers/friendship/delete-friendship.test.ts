import { FriendshipControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";
import { mockFriendship } from "./setup";

describe("deleteFriendship", () => {
  it("should delete a friendship successfully", async () => {
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

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should fail if user is not part of the friendship", async () => {
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

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should fail if the friendship does not exist", async () => {
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

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
