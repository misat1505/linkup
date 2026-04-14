import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { AuthControllers } from "@/controllers";
import { seedProvider } from "@tests/utils/seedProvider";
import { StatusCodes } from "http-status-codes";

describe("getUser", () => {
  it("retrieves authenticated user by ID", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      mockUserService.getUser.mockResolvedValue(seed);

      const req = mockRequest({ user });
      const res = mockResponse();

      await AuthControllers.getSelf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });
  });

  it("returns 404 for non-existent user", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      mockUserService.getUser.mockResolvedValue(null);

      const req = mockRequest({ user });
      const res = mockResponse();

      await AuthControllers.getSelf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });
  });
});
