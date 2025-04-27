import { ChatControllers } from "../../../src/controllers";
import { processAvatar } from "../../../src/utils/processAvatar";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

jest.mock("../../../src/utils/processAvatar");

describe("createGroupChat", () => {
  it("should create a group chat if user is in the list", async () => {
    const chat = { id: "chat1" };
    (processAvatar as jest.Mock).mockResolvedValue("file");
    mockChatService.createGroupChat.mockResolvedValue(chat);

    const req = mockRequest({
      body: {
        token: { userId: "userId" },
        users: ["userId", "user2"],
        name: "Group Chat",
      },
    });
    const res = mockResponse();
    await ChatControllers.createGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("shouldn't allow if user is not in the user list", async () => {
    (processAvatar as jest.Mock).mockResolvedValue("file");

    const req = mockRequest({
      body: {
        token: { userId: "userId" },
        users: ["user2", "user3"],
        name: "Group Chat",
      },
    });
    const res = mockResponse();
    await ChatControllers.createGroupChat(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
