import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { processAvatar } from "@/utils/processAvatar";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

jest.mock("@/utils/processAvatar");

describe("createGroupChat", () => {
  it("creates group chat with user included", async () => {
    const chat = { id: "chat1" };
    (processAvatar as jest.Mock).mockResolvedValue("file");
    mockChatService.createGroupChat.mockResolvedValue(chat);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["userId", "user2"],
          name: "Group Chat",
        },
      },
    });
    const res = mockResponse();
    await ChatControllers.createGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  });

  it("blocks group chat creation without user", async () => {
    (processAvatar as jest.Mock).mockResolvedValue("file");

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          users: ["user2", "user3"],
          name: "Group Chat",
        },
      },
    });
    const res = mockResponse();
    await ChatControllers.createGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  });
});
