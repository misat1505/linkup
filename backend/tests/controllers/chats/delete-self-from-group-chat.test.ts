import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("deleteUserFromGroupChat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("removes user from group chat successfully", async () => {
    mockChatService.getChatType.mockResolvedValue("GROUP");
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.deleteFromChat.mockResolvedValue(undefined);

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { params: { chatId: "123" } },
    });
    const res = mockResponse();
    await ChatControllers.deleteSelfFromGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
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

  it("returns 401 for non-group chat", async () => {
    mockChatService.getChatType.mockResolvedValue("PRIVATE");

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { params: { chatId: "123" } },
    });
    const res = mockResponse();
    await ChatControllers.deleteSelfFromGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.isUserInChat).not.toHaveBeenCalled();
    expect(mockChatService.deleteFromChat).not.toHaveBeenCalled();
  });

  it("returns 400 for non-chat member", async () => {
    mockChatService.getChatType.mockResolvedValue("GROUP");
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { params: { chatId: "123" } },
    });
    const res = mockResponse();
    await ChatControllers.deleteSelfFromGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      userId: "789",
      chatId: "123",
    });
    expect(mockChatService.deleteFromChat).not.toHaveBeenCalled();
  });
});
