import { AuthControllers } from "@/controllers";
import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seed-provider";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("getUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves authenticated user by ID", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      mockUserService.getUser.mockResolvedValue(seed);

      const req = mockRequest({ user });
      const res = mockResponse();

      await AuthControllers.getSelf(req, res, vi.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });
  });

  it("returns 404 for non-existent user", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      mockUserService.getUser.mockResolvedValue(null);

      const req = mockRequest({ user });
      const res = mockResponse();

      await AuthControllers.getSelf(req, res, vi.fn());

      expect(respond).toHaveBeenCalledWith(
        StatusCodes.NOT_FOUND,
        expect.anything(),
      );
    });
  });
});
