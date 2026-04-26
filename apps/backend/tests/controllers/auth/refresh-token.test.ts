import { AuthControllers } from "@/controllers";
import { TokenProcessor } from "@/lib/TokenProcessor";
import { mockRequest, mockResponse } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seedProvider";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/lib/TokenProcessor");

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("refreshToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("refreshes authentication token", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      (TokenProcessor.encode as Mock).mockReturnValue("new_fake_jwt_token");

      const req = mockRequest({ user });
      const res = mockResponse();

      AuthControllers.refreshToken(req, res, vi.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
      expect(res.cookie).toHaveBeenCalled();
    });
  });
});
