import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

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
