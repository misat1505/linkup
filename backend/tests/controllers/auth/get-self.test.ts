import { mockRequest, mockResponse, mockUserService } from "../../utils/mocks";
import { AuthControllers } from "../../../src/controllers";
import { seedProvider } from "../../utils/seedProvider";

describe("getUser", () => {
  it("retrieves authenticated user by ID", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      mockUserService.getUser.mockResolvedValue(seed);

      const req = mockRequest({ user });
      const res = mockResponse();

      await AuthControllers.getSelf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  it("returns 404 for non-existent user", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      mockUserService.getUser.mockResolvedValue(null);

      const req = mockRequest({ user });
      const res = mockResponse();

      await AuthControllers.getSelf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
