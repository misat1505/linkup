import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("getChatMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves chat messages for authorized user", async () => {
    const messages = [{ id: "message1" }, { id: "message2" }];
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.getChatMessages.mockResolvedValue(messages);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { chatId: "someId" }, query: {} },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
  });

  it("blocks message access by non-chat member", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { chatId: "someId" }, query: {} },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.FORBIDDEN,
      expect.anything(),
    );
  });

  it("retrieves chat messages without responseId", async () => {
    const messages = [{ id: "message1" }, { id: "message2" }];
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.getChatMessages.mockResolvedValue(messages);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        params: { chatId: "someId" },
        query: { lastMessageId: "message1", limit: 5 },
      },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(mockChatService.getChatMessages).toHaveBeenCalledWith(
      "someId",
      "message1",
      5,
    );
  });

  it("retrieves chat messages for specific responseId", async () => {
    const messages = [{ id: "message1" }, { id: "message2" }];
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.getPostChatMessages.mockResolvedValue(messages);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        params: { chatId: "someId" },
        query: { responseId: "response123" },
      },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(mockChatService.getPostChatMessages).toHaveBeenCalledWith(
      "someId",
      "response123",
    );
  });

  it("handles null responseId and returns null", async () => {
    const messages = [{ id: "message1" }, { id: "message2" }];
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.getPostChatMessages.mockResolvedValue(messages);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        params: { chatId: "someId" },
        query: { responseId: null },
      },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(mockChatService.getPostChatMessages).toHaveBeenCalledWith(
      "someId",
      null,
    );
  });

  it("passes errors to error middleware", async () => {
    const errorMessage = "Error in processing request";
    mockChatService.isUserInChat.mockRejectedValue(new Error(errorMessage));

    const mockNextFunction = vi.fn();

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { chatId: "someId" }, query: {} },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
