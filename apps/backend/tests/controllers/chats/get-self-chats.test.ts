import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("getSelfChats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retrieves user's chats", async () => {
    const chats = [{ id: "chat1" }, { id: "chat2" }];
    mockChatService.getUserChats.mockResolvedValue(chats);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
    });
    const res = mockResponse();
    await ChatControllers.getSelfChats(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
  });
});
