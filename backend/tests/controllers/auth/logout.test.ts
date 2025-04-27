import { AuthControllers } from "../../../src/controllers";
import { TokenProcessor } from "../../../src/lib/TokenProcessor";
import { mockRequest, mockResponse } from "../../utils/mocks";

jest.mock("../../../src/lib/TokenProcessor");

describe("logout", () => {
  it("should log out a user", async () => {
    (TokenProcessor.encode as jest.Mock).mockReturnValue("logout_jwt_token");

    const req = mockRequest({ body: { token: { userId: 1 } } });
    const res = mockResponse();

    AuthControllers.logout(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.clearCookie).toHaveBeenCalled();
  });
});
