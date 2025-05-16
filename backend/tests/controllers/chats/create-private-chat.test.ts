import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("createPrivateChat", () => {
  it("creates private chat with user included", async () => {
    const chat = { id: "chat1" };
    mockChatService.getPrivateChatByUserIds.mockResolvedValue(null);
    mockChatService.createPrivateChat.mockResolvedValue(chat);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["userId", "user2"],
        },
      },
    });
    const res = mockResponse();
    await ChatControllers.createPrivateChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  });

  it("returns conflict for existing private chat", async () => {
    const existingChat = { id: "chat1" };
    mockChatService.getPrivateChatByUserIds.mockResolvedValue(existingChat);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["userId", "user2"],
        },
      },
    });
    const res = mockResponse();
    await ChatControllers.createPrivateChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
  });

  it("blocks private chat creation without user", async () => {
    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["user2", "user3"],
        },
      },
    });
    const res = mockResponse();
    await ChatControllers.createPrivateChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  });
});
