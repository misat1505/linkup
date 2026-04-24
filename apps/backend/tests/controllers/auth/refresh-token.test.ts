import { AuthControllers } from "@/controllers";
import { TokenProcessor } from "@/lib/TokenProcessor";
import { mockRequest, mockResponse } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seedProvider";
import { StatusCodes } from "http-status-codes";

jest.mock("@/lib/TokenProcessor");

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("refreshToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("refreshes authentication token", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      (TokenProcessor.encode as jest.Mock).mockReturnValue(
        "new_fake_jwt_token",
      );

      const req = mockRequest({ user });
      const res = mockResponse();

      AuthControllers.refreshToken(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
      expect(res.cookie).toHaveBeenCalled();
    });
  });
});
