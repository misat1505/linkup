import { FriendshipControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import {
  mockFriendshipService,
  mockRequest,
  mockResponse,
} from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFriendship } from "./setup";

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("createFriendship", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    await FriendshipControllers.createFriendship(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CREATED,
      expect.anything(),
    );
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

    await FriendshipControllers.createFriendship(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      expect.anything(),
    );
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

    await FriendshipControllers.createFriendship(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CONFLICT,
      expect.anything(),
    );
  });
});
