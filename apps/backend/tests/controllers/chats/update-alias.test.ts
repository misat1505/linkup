import { ChatControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/user-with-credentials";
import { mockChatService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("updateAlias", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("updates alias successfully", async () => {
		mockChatService.isUserInChat.mockResolvedValue(true);
		mockChatService.updateAlias.mockResolvedValue(null);

		const req = mockRequest({
			user: { id: "userId" } as UserWithCredentials,
			validated: {
				body: { alias: "NewAlias" },
				params: { chatId: "123", userId: "456" },
			},
		});
		const res = mockResponse();
		await ChatControllers.updateAlias(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
		expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
		expect(mockChatService.updateAlias).toHaveBeenCalledWith({
			userId: "456",
			chatId: "123",
			alias: "NewAlias",
		});
	});

	it("returns 400 for non-chat member update", async () => {
		mockChatService.isUserInChat.mockResolvedValueOnce(false);

		const req = mockRequest({
			user: { id: "userId" } as UserWithCredentials,
			validated: { body: {}, params: { chatId: "123", userId: "456" } },
		});
		const res = mockResponse();
		await ChatControllers.updateAlias(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST, expect.anything());
		expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(1);
		expect(mockChatService.updateAlias).not.toHaveBeenCalled();
	});

	it("returns 403 for unauthorized requester", async () => {
		mockChatService.isUserInChat.mockResolvedValueOnce(true);
		mockChatService.isUserInChat.mockResolvedValueOnce(false);

		const req = mockRequest({
			user: { id: "userId" } as UserWithCredentials,
			validated: { body: {}, params: { chatId: "123", userId: "456" } },
		});
		const res = mockResponse();
		await ChatControllers.updateAlias(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.FORBIDDEN, expect.anything());
		expect(mockChatService.isUserInChat).toHaveBeenCalledTimes(2);
		expect(mockChatService.updateAlias).not.toHaveBeenCalled();
	});
});
