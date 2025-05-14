import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("createMessage", () => {
  it("creates message for authorized user", async () => {
    const newMessage = { id: "message1", content: "Hello" };
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.createMessage.mockResolvedValue(newMessage);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { body: { content: "Hello" }, params: { chatId: "someId" } },
      files: [],
    });
    const res = mockResponse();
    await ChatControllers.createMessage(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  });

  it("blocks message creation by non-chat member", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { body: { content: "Hello" }, params: { chatId: "someId" } },
      files: [],
    });
    const res = mockResponse();
    await ChatControllers.createMessage(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
  });

  it("blocks message with responseId outside chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.isMessageInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          content: "Hello",
          responseId: "responseId",
        },
        params: { chatId: "someId" },
      },
      files: [],
    });
    const res = mockResponse();
    await ChatControllers.createMessage(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  });
});
