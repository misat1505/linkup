import { USER_WITHOUT_CREDENTIALS } from "../utils/constants";
import { searchUserController } from "../../src/controllers/user/searchUser.controller";
import { mockRequest, mockResponse, mockUserService } from "../utils/mocks";
import { seedProvider } from "../utils/seedProvider";

describe("User controllers", () => {
  describe("searchUser", () => {
    it("should return users", async () => {
      await seedProvider(async (seed) => {
        const users = seed.users;
        mockUserService.searchUsers.mockResolvedValue(users);

        const req = mockRequest({
          query: { term: "abc" },
        });

        const res = mockResponse();

        await searchUserController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ users });
      });
    });

    it("fails if term not provided", async () => {
      await seedProvider(async (seed) => {
        const users = seed.users;
        mockUserService.searchUsers.mockResolvedValue(users);

        const req = mockRequest({ query: {} });
        const res = mockResponse();

        await searchUserController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    it("fails if term provided more than once", async () => {
      await seedProvider(async (seed) => {
        const users = seed.users;
        mockUserService.searchUsers.mockResolvedValue(users);

        const req = mockRequest({
          query: { term: ["abc", "dbc"] },
        });
        const res = mockResponse();

        await searchUserController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });
  });
});
