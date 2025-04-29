import { UserControllers } from "../../../src/controllers";
import { mockRequest, mockResponse, mockUserService } from "../../utils/mocks";
import { seedProvider } from "../../utils/seedProvider";

describe("searchUser", () => {
  it("should return users", async () => {
    await seedProvider(async (seed) => {
      const users = seed.users;
      mockUserService.searchUsers.mockResolvedValue(users);

      const req = mockRequest({
        validated: { query: { term: "abc" } },
      });

      const res = mockResponse();

      await UserControllers.searchUser(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users });
    });
  });
});
