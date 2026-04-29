import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/user-with-credentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("createReaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates message reaction", async () => {
    const newReactionData = "reaction";
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.isMessageInChat.mockResolvedValue(true);
    mockChatService.createReactionToMessage.mockResolvedValue(newReactionData);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          reactionId: "reactionId",
          messageId: "messageId",
        },
        params: { chatId: "someId" },
      },
    });
    const res = mockResponse();
    await ChatControllers.createReaction(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CREATED,
      expect.anything(),
    );
  });

  it("blocks reaction for message outside chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.isMessageInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          reactionId: "reactionId",
          messageId: "messageId",
        },
        params: { chatId: "someId" },
      },
    });
    const res = mockResponse();
    await ChatControllers.createReaction(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      expect.anything(),
    );
  });

  it("blocks reaction by non-chat member", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          reactionId: "reactionId",
          messageId: "messageId",
        },
        params: { chatId: "someId" },
      },
    });
    const res = mockResponse();
    await ChatControllers.createReaction(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.FORBIDDEN,
      expect.anything(),
    );
  });
});
