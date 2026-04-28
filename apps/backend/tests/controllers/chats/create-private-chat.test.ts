import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("createPrivateChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates private chat with user included", async () => {
    const chat = { id: "chat1" };
    mockChatService.getPrivateChatByUserIds.mockResolvedValue(null);
    mockChatService.createPrivateChat.mockResolvedValue(chat);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["userId", "user2"],
        },
      },
    });
    const res = mockResponse();
    await ChatControllers.createPrivateChat(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CREATED,
      expect.anything(),
    );
  });

  it("returns conflict for existing private chat", async () => {
    const existingChat = { id: "chat1" };
    mockChatService.getPrivateChatByUserIds.mockResolvedValue(existingChat);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["userId", "user2"],
        },
      },
    });
    const res = mockResponse();
    await ChatControllers.createPrivateChat(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CONFLICT,
      expect.anything(),
    );
  });

  it("blocks private chat creation without user", async () => {
    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["user2", "user3"],
        },
      },
    });
    const res = mockResponse();
    await ChatControllers.createPrivateChat(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      expect.anything(),
    );
  });
});
