import { ChatControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("createReaction", () => {
  it("should create a reaction", async () => {
    const newReactionData = "reaction";
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.isMessageInChat.mockResolvedValue(true);
    mockChatService.createReactionToMessage.mockResolvedValue(newReactionData);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      body: {
        reactionId: "reactionId",
        messageId: "messageId",
      },
      params: { chatId: "someId" },
    });
    const res = mockResponse();
    await ChatControllers.createReaction(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("shouldn't allow if messageId is not message in chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.isMessageInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      body: {
        reactionId: "reactionId",
        messageId: "messageId",
      },
      params: { chatId: "someId" },
    });
    const res = mockResponse();
    await ChatControllers.createReaction(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("shouldn't allow if user doesn't belong to the chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      body: {
        reactionId: "reactionId",
        messageId: "messageId",
      },
      params: { chatId: "someId" },
    });
    const res = mockResponse();
    await ChatControllers.createReaction(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
