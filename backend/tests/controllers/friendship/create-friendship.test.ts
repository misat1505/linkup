import { FriendshipControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";
import { mockFriendship } from "./setup";

describe("createFriendship", () => {
  it("should create a friendship successfully", async () => {
    mockFriendshipService.createFriendship.mockResolvedValue(mockFriendship);

    const req = mockRequest({
      user: { id: mockFriendship.requester.id } as UserWithCredentials,
      body: {
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
      user: { id: "differen-user-id" } as UserWithCredentials,
      body: {
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
      user: { id: mockFriendship.requester.id } as UserWithCredentials,
      body: {
        requesterId: mockFriendship.requester.id,
        acceptorId: mockFriendship.acceptor.id,
      },
    });
    const res = mockResponse();

    await FriendshipControllers.createFriendship(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });
});
