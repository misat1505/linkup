import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { processAvatar } from "@/utils/processAvatar";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

jest.mock("@/utils/processAvatar");

describe("updateGroupChat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates group chat successfully", async () => {
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

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
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

  it("returns 403 for unauthorized user", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "789" } as UserWithCredentials,
      validated: { body: { name: "New Chat Name" }, params: { chatId: "123" } },
    });
    const res = mockResponse();

    await ChatControllers.updateGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      chatId: "123",
      userId: "789",
    });
    expect(mockChatService.getChatType).not.toHaveBeenCalled();
    expect(processAvatar).not.toHaveBeenCalled();
    expect(mockChatService.updateGroupChat).not.toHaveBeenCalled();
  });

  it("returns 400 for non-group chat", async () => {
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

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      chatId: "123",
      userId: "789",
    });
    expect(processAvatar).not.toHaveBeenCalled();
    expect(mockChatService.updateGroupChat).not.toHaveBeenCalled();
  });
});
