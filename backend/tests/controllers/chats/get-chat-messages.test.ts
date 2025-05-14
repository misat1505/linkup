import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("getChatMessages", () => {
  it("retrieves chat messages for authorized user", async () => {
    const messages = [{ id: "message1" }, { id: "message2" }];
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.getChatMessages.mockResolvedValue(messages);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { chatId: "someId" }, query: {} },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it("blocks message access by non-chat member", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { chatId: "someId" }, query: {} },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
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
    await ChatControllers.getChatMessages(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockChatService.getChatMessages).toHaveBeenCalledWith(
      "someId",
      "message1",
      5
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
    await ChatControllers.getChatMessages(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockChatService.getPostChatMessages).toHaveBeenCalledWith(
      "someId",
      "response123"
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
    await ChatControllers.getChatMessages(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockChatService.getPostChatMessages).toHaveBeenCalledWith(
      "someId",
      null
    );
  });

  it("passes errors to error middleware", async () => {
    const errorMessage = "Error in processing request";
    mockChatService.isUserInChat.mockRejectedValue(new Error(errorMessage));

    const mockNextFunction = jest.fn();

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { chatId: "someId" }, query: {} },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
