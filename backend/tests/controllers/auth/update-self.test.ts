import { AuthControllers } from "../../../src/controllers";
import { mockRequest, mockResponse, mockUserService } from "../../utils/mocks";
import { seedProvider } from "../../utils/seedProvider";

describe("updateUser", () => {
  it("should update user", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUserByLogin.mockResolvedValue({
        id: "some-id",
        login: "some-login",
        photoURL: "some-url",
      });

      const req = mockRequest({
        body: {
          firstName: "John",
          lastName: "Doe",
          login: "login1",
          password: "pass1",
          token: { userId: seed.users[0].id },
        },
      });
      const res = mockResponse();
      await AuthControllers.updateSelf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  it("should update user when same id", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUserByLogin.mockResolvedValue({
        id: seed.users[0].id,
        login: "some-login",
        photoURL: "some-url",
      });

      const req = mockRequest({
        body: {
          firstName: "John",
          lastName: "Doe",
          login: "login1",
          password: "pass1",
          token: { userId: seed.users[0].id },
        },
      });
      const res = mockResponse();

      await AuthControllers.updateSelf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  it("shouldn't allow 2 users of the same login", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUserByLogin.mockResolvedValue({
        id: "some-id",
        login: "login1",
        photoURL: "some-url",
      });

      const req = mockRequest({
        body: {
          firstName: "John",
          lastName: "Doe",
          login: "login1",
          password: "pass1",
          token: { userId: seed.users[0].id },
        },
      });
      const res = mockResponse();

      await AuthControllers.updateSelf(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });
});
