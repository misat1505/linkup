import { StatusCodes } from "http-status-codes";
import { AuthControllers } from "../../../src/controllers";
import { TokenProcessor } from "../../../src/lib/TokenProcessor";
import { mockRequest, mockResponse } from "../../utils/mocks";
import { seedProvider } from "../../utils/seedProvider";

jest.mock("../../../src/lib/TokenProcessor");

describe("logout", () => {
  it("logs out user", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      (TokenProcessor.encode as jest.Mock).mockReturnValue("logout_jwt_token");

      const req = mockRequest({ user });
      const res = mockResponse();

      AuthControllers.logout(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.clearCookie).toHaveBeenCalled();
    });
  });
});
