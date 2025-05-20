import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";

describe("updateAlias", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates alias successfully", async () => {
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.updateAlias.mockResolvedValue(null);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: { alias: "NewAlias" },
        params: { chatId: "123", userId: "456" },
      },
    });
    const res = mockResponse();
    await ChatControllers.updateAlias(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
    expect(mockChatService.updateAlias).toHaveBeenCalledWith({
      userId: "456",
      chatId: "123",
      alias: "NewAlias",
    });
  });

  it("returns 400 for non-chat member update", async () => {
    mockChatService.isUserInChat.mockResolvedValueOnce(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { body: {}, params: { chatId: "123", userId: "456" } },
    });
    const res = mockResponse();
    await ChatControllers.updateAlias(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(1);
    expect(mockChatService.updateAlias).not.toHaveBeenCalled();
  });

  it("returns 403 for unauthorized requester", async () => {
    mockChatService.isUserInChat.mockResolvedValueOnce(true);
    mockChatService.isUserInChat.mockResolvedValueOnce(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { body: {}, params: { chatId: "123", userId: "456" } },
    });
    const res = mockResponse();
    await ChatControllers.updateAlias(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
    expect(mockChatService.updateAlias).not.toHaveBeenCalled();
  });
});
