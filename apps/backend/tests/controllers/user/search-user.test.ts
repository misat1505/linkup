import { UserControllers } from "@/controllers";
import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seed-provider";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("searchUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("retrieves users matching search criteria", async () => {
		await seedProvider(async (seed) => {
			const users = seed.users;
			mockUserService.searchUsers.mockResolvedValue(users);

			const req = mockRequest({
				validated: { query: { term: "abc" } },
			});

			const res = mockResponse();

			await UserControllers.searchUser(req, res, vi.fn());

			expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
		});
	});
});
