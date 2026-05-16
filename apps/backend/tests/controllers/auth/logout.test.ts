import { AuthControllers } from "@/controllers";
import { TokenProcessor } from "@/lib/token-processor";
import { mockRequest, mockResponse } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seed-provider";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/lib/token-processor");

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("logout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("logs out user", async () => {
		await seedProvider(async (seed) => {
			const user = seed.users[0];
			(TokenProcessor.encode as Mock).mockReturnValue("logout_jwt_token");

			const req = mockRequest({ user });
			const res = mockResponse();

			AuthControllers.logout(req, res, vi.fn());

			expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
			expect(res.clearCookie).toHaveBeenCalled();
		});
	});
});
