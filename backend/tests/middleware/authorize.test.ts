import { authorize } from "../../src/middlewares/authorize";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { env } from "../../src/config/env";
import { seedProvider } from "../utils/seedProvider";
import { mockRequest, mockResponse, mockUserService } from "../utils/mocks";

describe("authorize middleware", () => {
  const mockNextFunction = jest.fn();

  it("should append token on authorized", async () => {
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

  it("shouldn't allow valid token of non-existent user", async () => {
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

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  it("shouldn't allow no token", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUser.mockResolvedValue(seed.users[0]);

      const req = mockRequest({
        headers: {},
      });
      const res = mockResponse();

      await authorize(req, res, mockNextFunction);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  it("shouldn't allow invalid token", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUser.mockResolvedValue(seed.users[0]);
      const req = mockRequest({
        headers: { authorization: "Bearer invalid" },
      });
      const res = mockResponse();

      await authorize(req, res, mockNextFunction);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
