import { StatusCodes } from "http-status-codes";
import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { mockChatService, mockRequest, mockResponse } from "../../utils/mocks";

describe("createReaction", () => {
  it("creates message reaction", async () => {
    const newReactionData = "reaction";
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.isMessageInChat.mockResolvedValue(true);
    mockChatService.createReactionToMessage.mockResolvedValue(newReactionData);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          reactionId: "reactionId",
          messageId: "messageId",
        },
        params: { chatId: "someId" },
      },
    });
    const res = mockResponse();
    await ChatControllers.createReaction(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  });

  it("blocks reaction for message outside chat", async () => {
    mockChatService.isUserInChat.mockResolvedValue(true);
    mockChatService.isMessageInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          reactionId: "reactionId",
          messageId: "messageId",
        },
        params: { chatId: "someId" },
      },
    });
    const res = mockResponse();
    await ChatControllers.createReaction(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  });

  it("blocks reaction by non-chat member", async () => {
    mockChatService.isUserInChat.mockResolvedValue(false);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        body: {
          reactionId: "reactionId",
          messageId: "messageId",
        },
        params: { chatId: "someId" },
      },
    });
    const res = mockResponse();
    await ChatControllers.createReaction(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
  });
});
