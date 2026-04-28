import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("createMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates message for authorized user", async () => {
    const newMessage = { id: "message1", content: "Hello" };
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.createMessage.mockResolvedValue(newMessage);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { body: { content: "Hello" }, params: { chatId: "someId" } },
      files: [],
    });
    const res = mockResponse();
    await ChatControllers.createMessage(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CREATED,
      expect.anything(),
    );
  });

  it("blocks message creation by non-chat member", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { body: { content: "Hello" }, params: { chatId: "someId" } },
      files: [],
    });
    const res = mockResponse();
    await ChatControllers.createMessage(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.FORBIDDEN,
      expect.anything(),
    );
  });

  it("blocks message with responseId outside chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.isMessageInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          content: "Hello",
          responseId: "responseId",
        },
        params: { chatId: "someId" },
      },
      files: [],
    });
    const res = mockResponse();
    await ChatControllers.createMessage(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      expect.anything(),
    );
  });
});
