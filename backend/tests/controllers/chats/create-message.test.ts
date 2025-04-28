import { ChatControllers } from "../../../src/controllers";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("createMessage", () => {
  it("should create a message if the user is authorized", async () => {
    const newMessage = { id: "message1", content: "Hello" };
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.createMessage.mockResolvedValue(newMessage);

    const req = mockRequest({
      body: { content: "Hello", token: { userId: "userId" } },
      params: { chatId: "someId" },
      files: [],
    });
    const res = mockResponse();
    await ChatControllers.createMessage(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("shouldn't allow sending a message if the user is not in the chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      body: { content: "Hello", token: { userId: "userId" } },
      params: { chatId: "someId" },
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
      body: {
        content: "Hello",
        token: { userId: "userId" },
        responseId: "responseId",
      },
      params: { chatId: "someId" },
      files: [],
    });
    const res = mockResponse();
    await ChatControllers.createMessage(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
