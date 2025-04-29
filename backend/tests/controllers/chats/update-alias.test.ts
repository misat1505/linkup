import { ChatControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("updateAlias", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update alias successfully", async () => {
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

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
    expect(mockChatService.updateAlias).toHaveBeenCalledWith({
      userId: "456",
      chatId: "123",
      alias: "NewAlias",
    });
  });

  it("should return 401 if the user to update is not in the chat", async () => {
    mockChatService.isUserInChat.mockResolvedValueOnce(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { body: {}, params: { chatId: "123", userId: "456" } },
    });
    const res = mockResponse();
    await ChatControllers.updateAlias(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(1);
    expect(mockChatService.updateAlias).not.toHaveBeenCalled();
  });

  it("should return 401 if the requesting user is not authorized", async () => {
    mockChatService.isUserInChat.mockResolvedValueOnce(true);
    mockChatService.isUserInChat.mockResolvedValueOnce(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { body: {}, params: { chatId: "123", userId: "456" } },
    });
    const res = mockResponse();
    await ChatControllers.updateAlias(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
    expect(mockChatService.updateAlias).not.toHaveBeenCalled();
  });
});
