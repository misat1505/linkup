import { authorize } from "@/middlewares/authorize";
import { TokenProcessor } from "@/lib/TokenProcessor";
import { env } from "@/config/env";
import { seedProvider } from "../utils/seedProvider";
import { mockRequest, mockResponse, mockUserService } from "../utils/mocks";
import { StatusCodes } from "http-status-codes";

describe("authorize middleware", () => {
  const mockNextFunction = jest.fn();

  it("appends token for authorized user", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUser.mockResolvedValue(seed.users[0]);
      const token = TokenProcessor.encode(
        { userId: seed.users[0].id },
        env.ACCESS_TOKEN_SECRET
      );

      const req = mockRequest({
        headers: { authorization: `Bearer ${token}` },
        body: {},
      });
      const res = mockResponse();

      await authorize(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });

  it("blocks valid token for non-existent user", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUser.mockResolvedValue(null);
      const token = TokenProcessor.encode(
        { userId: seed.users[0].id },
        env.ACCESS_TOKEN_SECRET
      );

      const req = mockRequest({
        headers: { authorization: `Bearer ${token}` },
      });
      const res = mockResponse();

      await authorize(req, res, mockNextFunction);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });
  });

  it("blocks missing token", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUser.mockResolvedValue(seed.users[0]);

      const req = mockRequest({
        headers: {},
      });
      const res = mockResponse();

      await authorize(req, res, mockNextFunction);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });
  });

  it("blocks invalid token", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUser.mockResolvedValue(seed.users[0]);
      const req = mockRequest({
        headers: { authorization: "Bearer invalid" },
      });
      const res = mockResponse();

      await authorize(req, res, mockNextFunction);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });
  });
});
