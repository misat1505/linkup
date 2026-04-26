import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("getSelfChats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves user's chats", async () => {
    const chats = [{ id: "chat1" }, { id: "chat2" }];
    mockChatService.getUserChats.mockResolvedValue(chats);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
    });
    const res = mockResponse();
    await ChatControllers.getSelfChats(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
  });
});
