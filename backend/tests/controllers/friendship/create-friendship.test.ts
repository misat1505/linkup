import { FriendshipControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";
import { mockFriendship } from "./setup";

describe("createFriendship", () => {
  it("creates friendship successfully", async () => {
    mockFriendshipService.createFriendship.mockResolvedValue(mockFriendship);

    const req = mockRequest({
      user: { id: mockFriendship.requester.id } as UserWithCredentials,
      validated: {
        body: {
          requesterId: mockFriendship.requester.id,
          acceptorId: mockFriendship.acceptor.id,
        },
      },
    });
    const res = mockResponse();

    await FriendshipControllers.createFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("fails for mismatched requesterId", async () => {
    mockFriendshipService.createFriendship.mockResolvedValue(mockFriendship);

    const req = mockRequest({
      user: { id: "differen-user-id" } as UserWithCredentials,
      validated: {
        body: {
          requesterId: mockFriendship.requester.id,
          acceptorId: mockFriendship.acceptor.id,
        },
      },
    });
    const res = mockResponse();

    await FriendshipControllers.createFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("fails for existing friendship", async () => {
    mockFriendshipService.createFriendship.mockResolvedValue(null);

    const req = mockRequest({
      user: { id: mockFriendship.requester.id } as UserWithCredentials,
      validated: {
        body: {
          requesterId: mockFriendship.requester.id,
          acceptorId: mockFriendship.acceptor.id,
        },
      },
    });
    const res = mockResponse();

    await FriendshipControllers.createFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });
});
