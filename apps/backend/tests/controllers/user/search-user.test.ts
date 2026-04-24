import { UserControllers } from "@/controllers";
import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seedProvider";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("searchUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retrieves users matching search criteria", async () => {
    await seedProvider(async (seed) => {
      const users = seed.users;
      mockUserService.searchUsers.mockResolvedValue(users);

      const req = mockRequest({
        validated: { query: { term: "abc" } },
      });

      const res = mockResponse();

      await UserControllers.searchUser(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });
  });
});
