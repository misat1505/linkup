import { ChatControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("addUserToGroupChat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("adds user to group chat successfully", async () => {
    mockChatService.getChatType.mockResolvedValue("GROUP");
    mockChatService.isUserInChat.mockResolvedValueOnce(true);
    mockChatService.isUserInChat.mockResolvedValueOnce(false);
    mockChatService.addUserToChat.mockResolvedValue({
      id: "newUserId",
      name: "New User",
    });

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { userId: "456" }, params: { chatId: "123" } },
    });
    const res = mockResponse();
    await ChatControllers.addUserToGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      userId: "789",
      chatId: "123",
    });
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      userId: "456",
      chatId: "123",
    });
    expect(mockChatService.addUserToChat).toHaveBeenCalledWith({
      chatId: "123",
      userId: "456",
    });
  });

  it("returns 401 for non-group chat", async () => {
    mockChatService.getChatType.mockResolvedValue("PRIVATE");

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { userId: "456" }, params: { chatId: "123" } },
    });
    const res = mockResponse();
    await ChatControllers.addUserToGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.addUserToChat).not.toHaveBeenCalled();
  });

  it("returns 401 for non-member requester", async () => {
    mockChatService.getChatType.mockResolvedValue("GROUP");
    mockChatService.isUserInChat.mockResolvedValueOnce(false);

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { userId: "456" }, params: { chatId: "123" } },
    });
    const res = mockResponse();
    await ChatControllers.addUserToGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.addUserToChat).not.toHaveBeenCalled();
  });

  it("returns 409 for already added user", async () => {
    mockChatService.getChatType.mockResolvedValue("GROUP");
    mockChatService.isUserInChat.mockResolvedValueOnce(true);
    mockChatService.isUserInChat.mockResolvedValueOnce(true);

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { userId: "456" }, params: { chatId: "123" } },
    });
    const res = mockResponse();
    await ChatControllers.addUserToGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
    expect(mockChatService.addUserToChat).not.toHaveBeenCalled();
  });
});
