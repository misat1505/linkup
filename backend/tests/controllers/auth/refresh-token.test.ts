import { AuthControllers } from "../../../src/controllers";
import { TokenProcessor } from "../../../src/lib/TokenProcessor";
import { mockRequest, mockResponse } from "../../utils/mocks";
import { seedProvider } from "../../utils/seedProvider";

jest.mock("../../../src/lib/TokenProcessor");

describe("refreshToken", () => {
  it("should refresh a token", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      (TokenProcessor.encode as jest.Mock).mockReturnValue(
        "new_fake_jwt_token"
      );

      const req = mockRequest({ user });
      const res = mockResponse();

      AuthControllers.refreshToken(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ accessToken: expect.any(String) })
      );
      expect(res.cookie).toHaveBeenCalled();
    });
  });
});
