import { v4 as uuidv4 } from "uuid";
import { UserWithCredentials } from "../../../src/types/User";
import { mockRequest, mockResponse, mockUserService } from "../../utils/mocks";
import { AuthControllers } from "../../../src/controllers";
import { seedProvider } from "../../utils/seedProvider";

describe("getUser", () => {
  it("should get a user by id", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      mockUserService.getUser.mockResolvedValue(seed);

      const req = mockRequest({ user });
      const res = mockResponse();

      await AuthControllers.getSelf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  it("should return 404 if user not found", async () => {
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
