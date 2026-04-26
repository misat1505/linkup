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

describe("deleteFriendship", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    await FriendshipControllers.deleteFriendship(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
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

    await FriendshipControllers.deleteFriendship(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.FORBIDDEN,
      expect.anything(),
    );
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

    await FriendshipControllers.deleteFriendship(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.NOT_FOUND,
      expect.anything(),
    );
  });
});
