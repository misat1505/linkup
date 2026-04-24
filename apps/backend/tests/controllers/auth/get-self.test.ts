import { AuthControllers } from "@/controllers";
import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seedProvider";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("getUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retrieves authenticated user by ID", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      mockUserService.getUser.mockResolvedValue(seed);

      const req = mockRequest({ user });
      const res = mockResponse();

      await AuthControllers.getSelf(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });
  });

  it("returns 404 for non-existent user", async () => {
    await seedProvider(async (seed) => {
      const user = seed.users[0];
      mockUserService.getUser.mockResolvedValue(null);

      const req = mockRequest({ user });
      const res = mockResponse();

      await AuthControllers.getSelf(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(
        StatusCodes.NOT_FOUND,
        expect.anything(),
      );
    });
  });
});
