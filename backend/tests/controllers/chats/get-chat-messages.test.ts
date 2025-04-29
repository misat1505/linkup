import { ChatControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("getChatMessages", () => {
  it("should return chat messages if the user is authorized", async () => {
    const messages = [{ id: "message1" }, { id: "message2" }];
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.getChatMessages.mockResolvedValue(messages);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { chatId: "someId" }, query: {} },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("shouldn't allow access if the user is not in the chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { chatId: "someId" }, query: {} },
    });
    const res = mockResponse();
    await ChatControllers.getChatMessages(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return chat messages when no responseId is provided", async () => {
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

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockChatService.getChatMessages).toHaveBeenCalledWith(
      "someId",
      "message1",
      5
    );
  });

  it("should return chat messages for a specific responseId", async () => {
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

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockChatService.getPostChatMessages).toHaveBeenCalledWith(
      "someId",
      "response123"
    );
  });

  it("should treat 'null' as a valid responseId and return null", async () => {
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

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockChatService.getPostChatMessages).toHaveBeenCalledWith(
      "someId",
      null
    );
  });

  it("should pass to error middleware if an error occurs", async () => {
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
