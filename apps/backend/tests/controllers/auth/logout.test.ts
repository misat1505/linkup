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

describe("logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs out user", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      (TokenProcessor.encode as jest.Mock).mockReturnValue("logout_jwt_token");

      const req = mockRequest({ user });
      const res = mockResponse();

      AuthControllers.logout(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
      expect(res.clearCookie).toHaveBeenCalled();
    });
  });
});
