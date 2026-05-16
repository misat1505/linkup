import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/user-with-credentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("deleteUserFromGroupChat", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("removes user from group chat successfully", async () => {
		mockChatService.getChatType.mockResolvedValue("GROUP");
		mockChatService.isUserInChat.mockResolvedValue(true);
		mockChatService.deleteFromChat.mockResolvedValue(undefined);

		const req = mockRequest({
			user: { id: "789" } as UserWithCredentials,
			validated: { params: { chatId: "123" } },
		});
		const res = mockResponse();
		await ChatControllers.deleteSelfFromGroupChat(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
		expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
		expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
			userId: "789",
			chatId: "123",
		});
		expect(mockChatService.deleteFromChat).toHaveBeenCalledWith({
			chatId: "123",
			userId: "789",
		});
	});

	it("returns 401 for non-group chat", async () => {
		mockChatService.getChatType.mockResolvedValue("PRIVATE");

		const req = mockRequest({
			user: { id: "789" } as UserWithCredentials,
			validated: { params: { chatId: "123" } },
		});
		const res = mockResponse();
		await ChatControllers.deleteSelfFromGroupChat(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST, expect.anything());
		expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
		expect(mockChatService.isUserInChat).not.toHaveBeenCalled();
		expect(mockChatService.deleteFromChat).not.toHaveBeenCalled();
	});

	it("returns 400 for non-chat member", async () => {
		mockChatService.getChatType.mockResolvedValue("GROUP");
		mockChatService.isUserInChat.mockResolvedValue(false);

		const req = mockRequest({
			user: { id: "789" } as UserWithCredentials,
			validated: { params: { chatId: "123" } },
		});
		const res = mockResponse();
		await ChatControllers.deleteSelfFromGroupChat(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST, expect.anything());
		expect(mockChatService.getChatType).toHaveBeenCalledWith("123");
		expect(mockChatService.isUserInChat).toHaveBeenCalledWith({
			userId: "789",
			chatId: "123",
		});
		expect(mockChatService.deleteFromChat).not.toHaveBeenCalled();
	});
});
