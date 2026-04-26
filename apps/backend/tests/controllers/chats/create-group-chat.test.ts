import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { processAvatar } from "@/utils/processAvatar";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/utils/processAvatar");

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("createGroupChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates group chat with user included", async () => {
    const chat = { id: "chat1" };

    (processAvatar as Mock).mockResolvedValue("file");
    mockChatService.createGroupChat.mockResolvedValue(chat);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["userId", "user2"],
          name: "Group Chat",
        },
      },
    });

    const res = mockResponse();

    await ChatControllers.createGroupChat(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CREATED,
      expect.anything(),
    );
  });

  it("blocks group chat creation without user", async () => {
    (processAvatar as Mock).mockResolvedValue("file");

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["user2", "user3"],
          name: "Group Chat",
        },
      },
    });

    const res = mockResponse();

    await ChatControllers.createGroupChat(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      expect.anything(),
    );
  });
});
