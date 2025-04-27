import { AuthControllers } from "../../../src/controllers";
import { TokenProcessor } from "../../../src/lib/TokenProcessor";
import { mockRequest, mockResponse } from "../../utils/mocks";

jest.mock("../../../src/lib/TokenProcessor");

describe("refreshToken", () => {
  it("should refresh a token", async () => {
    (TokenProcessor.encode as jest.Mock).mockReturnValue("new_fake_jwt_token");

    const req = mockRequest({ body: { token: { userId: 1 } } });
    const res = mockResponse();

    AuthControllers.refreshToken(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: expect.any(String) })
    );
    expect(res.cookie).toHaveBeenCalled();
  });
});
