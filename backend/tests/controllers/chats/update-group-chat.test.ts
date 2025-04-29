import { ChatControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { processAvatar } from "../../../src/utils/processAvatar";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

jest.mock("../../../src/utils/processAvatar");

describe("updateGroupChat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update group chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.getChatById.mockResolvedValue({
      type: "GROUP",
    });
    (processAvatar as jest.Mock).mockResolvedValue("processedAvatarPath");
    mockChatService.updateGroupChat.mockResolvedValue({
      id: "123",
      name: "New Chat Name",
      avatar: "processedAvatarPath",
    });

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { name: "New Chat Name" }, params: { chatId: "123" } },
    });
    const res = mockResponse();

    await ChatControllers.updateGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      chatId: "123",
      userId: "789",
    });
    expect(mockChatService.getChatById).toHaveBeenCalledWith("123");
    expect(mockChatService.updateGroupChat).toHaveBeenCalledWith({
      chatId: "123",
      file: "processedAvatarPath",
      name: "New Chat Name",
    });
  });

  it("should return 401 if the user is not authorized to update the chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { name: "New Chat Name" }, params: { chatId: "123" } },
    });
    const res = mockResponse();

    await ChatControllers.updateGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      chatId: "123",
      userId: "789",
    });
    expect(mockChatService.getChatType).not.toHaveBeenCalled();
    expect(processAvatar).not.toHaveBeenCalled();
    expect(mockChatService.updateGroupChat).not.toHaveBeenCalled();
  });

  it("should return 400 if the chat is not of type 'GROUP'", async () => {
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.getChatById.mockResolvedValue({
      type: "PRIVATE",
    });

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { name: "New Chat Name" }, params: { chatId: "123" } },
    });
    const res = mockResponse();

    await ChatControllers.updateGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      chatId: "123",
      userId: "789",
    });
    expect(processAvatar).not.toHaveBeenCalled();
    expect(mockChatService.updateGroupChat).not.toHaveBeenCalled();
  });
});
