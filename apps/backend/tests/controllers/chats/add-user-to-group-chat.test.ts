import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

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

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CREATED,
      expect.anything(),
    );
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

  it("returns 400 for non-group chat", async () => {
    mockChatService.getChatType.mockResolvedValue("PRIVATE");

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { userId: "456" }, params: { chatId: "123" } },
    });
    const res = mockResponse();
    await ChatControllers.addUserToGroupChat(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      expect.anything(),
    );
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.addUserToChat).not.toHaveBeenCalled();
  });

  it("returns 403 for non-member requester", async () => {
    mockChatService.getChatType.mockResolvedValue("GROUP");
    mockChatService.isUserInChat.mockResolvedValueOnce(false);

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { userId: "456" }, params: { chatId: "123" } },
    });
    const res = mockResponse();
    await ChatControllers.addUserToGroupChat(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.FORBIDDEN,
      expect.anything(),
    );
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

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CONFLICT,
      expect.anything(),
    );
    expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
    expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
    expect(mockChatService.addUserToChat).not.toHaveBeenCalled();
  });
});
