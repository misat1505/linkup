import { ChatControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("createMessage", () => {
  it("should create a message if the user is authorized", async () => {
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

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("shouldn't allow sending a message if the user is not in the chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { body: { content: "Hello" }, params: { chatId: "someId" } },
      files: [],
    });
    const res = mockResponse();
    await ChatControllers.createMessage(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("shouldn't allow sending a message if responseId is not in the chat", async () => {
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

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
