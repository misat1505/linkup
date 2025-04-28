import { ChatControllers } from "../../../src/controllers";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("createPrivateChat", () => {
  it("should create a private chat if user is in the list", async () => {
    const chat = { id: "chat1" };
    mockChatService.getPrivateChatByUserIds.mockResolvedValue(null);
    mockChatService.createPrivateChat.mockResolvedValue(chat);

    const req = mockRequest({
      body: {
        token: { userId: "userId" },
        users: ["userId", "user2"],
      },
    });
    const res = mockResponse();
    await ChatControllers.createPrivateChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should return conflict if chat already exists", async () => {
    const existingChat = { id: "chat1" };
    mockChatService.getPrivateChatByUserIds.mockResolvedValue(existingChat);

    const req = mockRequest({
      body: {
        token: { userId: "userId" },
        users: ["userId", "user2"],
      },
    });
    const res = mockResponse();
    await ChatControllers.createPrivateChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("shouldn't allow if user is not in the user list", async () => {
    const req = mockRequest({
      body: {
        token: { userId: "userId" },
        users: ["user2", "user3"],
      },
    });
    const res = mockResponse();
    await ChatControllers.createPrivateChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
