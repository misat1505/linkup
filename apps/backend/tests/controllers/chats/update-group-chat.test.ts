import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/user-with-credentials";
import { processAvatar } from "@/utils/process-avatar";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/utils/process-avatar");

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("updateGroupChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates group chat successfully", async () => {
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.getChatById.mockResolvedValue({
      type: "GROUP",
    });
    (processAvatar as Mock).mockResolvedValue("processedAvatarPath");
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

    await ChatControllers.updateGroupChat(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
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

    await ChatControllers.updateGroupChat(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.FORBIDDEN,
      expect.anything(),
    );
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

    await ChatControllers.updateGroupChat(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      expect.anything(),
    );
    expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
      chatId: "123",
      userId: "789",
    });
    expect(processAvatar).not.toHaveBeenCalled();
    expect(mockChatService.updateGroupChat).not.toHaveBeenCalled();
  });
});
