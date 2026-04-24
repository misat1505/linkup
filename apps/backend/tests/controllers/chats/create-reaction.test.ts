import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("createReaction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CREATED,
      expect.anything(),
    );
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

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      expect.anything(),
    );
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

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.FORBIDDEN,
      expect.anything(),
    );
  });
});
