import { StatusCodes } from "http-status-codes";
import { AuthControllers } from "@/controllers";
import { TokenProcessor } from "@/lib/TokenProcessor";
import { mockRequest, mockResponse } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seedProvider";

jest.mock("@/lib/TokenProcessor");

describe("refreshToken", () => {
  it("refreshes authentication token", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      (TokenProcessor.encode as jest.Mock).mockReturnValue(
        "new_fake_jwt_token"
      );

      const req = mockRequest({ user });
      const res = mockResponse();

      AuthControllers.refreshToken(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ accessToken: expect.any(String) })
      );
      expect(res.cookie).toHaveBeenCalled();
    });
  });
});
