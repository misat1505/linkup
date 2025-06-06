import { StatusCodes } from "http-status-codes";
import { UserControllers } from "@/controllers";
import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seedProvider";

describe("searchUser", () => {
  it("retrieves users matching search criteria", async () => {
    await seedProvider(async (seed) => {
      const users = seed.users;
      mockUserService.searchUsers.mockResolvedValue(users);

      const req = mockRequest({
        validated: { query: { term: "abc" } },
      });

      const res = mockResponse();

      await UserControllers.searchUser(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ users });
    });
  });
});
