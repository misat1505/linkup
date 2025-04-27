import { ChatControllers } from "../../../src/controllers";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("deleteUserFromGroupChat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully delete user from group chat", async () => {
    mockChatService.getChatType.mockResolvedValue("GROUP");
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.deleteFromChat.mockResolvedValue(undefined);

    const req = mockRequest({
      body: { token: { userId: "789" } },
      params: { chatId: "123" },
    });
    const res = mockResponse();
    await ChatControllers.deleteSelfFromGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      userId: "789",
      chatId: "123",
    });
    expect(mockChatService.deleteFromChat).toHaveBeenCalledWith({
      chatId: "123",
      userId: "789",
    });
  });

  it("should return 401 if chat is not of type 'GROUP'", async () => {
    mockChatService.getChatType.mockResolvedValue("PRIVATE");

    const req = mockRequest({
      body: { token: { userId: "789" } },
      params: { chatId: "123" },
    });
    const res = mockResponse();
    await ChatControllers.deleteSelfFromGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.isUserInChat).not.toHaveBeenCalled();
    expect(mockChatService.deleteFromChat).not.toHaveBeenCalled();
  });

  it("should return 401 if the user is not in the chat", async () => {
    mockChatService.getChatType.mockResolvedValue("GROUP");
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      body: { token: { userId: "789" } },
      params: { chatId: "123" },
    });
    const res = mockResponse();
    await ChatControllers.deleteSelfFromGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      userId: "789",
      chatId: "123",
    });
    expect(mockChatService.deleteFromChat).not.toHaveBeenCalled();
  });
});
