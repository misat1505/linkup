import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";

describe("getSelfChats", () => {
  it("retrieves user’s chats", async () => {
    const chats = [{ id: "chat1" }, { id: "chat2" }];
    mockChatService.getUserChats.mockResolvedValue(chats);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
    });
    const res = mockResponse();
    await ChatControllers.getSelfChats(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });
});
