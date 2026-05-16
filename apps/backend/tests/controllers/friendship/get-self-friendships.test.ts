import { FriendshipControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/user-with-credentials";
import { mockFriendshipService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFriendship } from "./setup";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("getUserFriendships", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("retrieves all user friendships", async () => {
		const mockFriendships = [
			{
				status: "ACCEPTED",
				requester: { id: "user-id-1", name: "User A" },
				acceptor: { id: "user-id-2", name: "User B" },
			},
		];

		mockFriendshipService.getUserFriendships.mockResolvedValue(mockFriendships);

		const req = mockRequest({
			user: { id: mockFriendship.requester.id } as UserWithCredentials,
		});
		const res = mockResponse();

		await FriendshipControllers.getUserFriendships(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
	});
});
