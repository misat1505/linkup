import { AuthControllers } from "@/controllers";
import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { seedProvider } from "@tests/utils/seed-provider";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("updateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates authenticated user profile", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUserByLogin.mockResolvedValue({
        id: "some-id",
        login: "some-login",
        photoURL: "some-url",
      });

      const req = mockRequest({
        validated: {
          body: {
            firstName: "John",
            lastName: "Doe",
            login: "login1",
            password: "pass1",
          },
        },
        user: seed.users[0],
      });
      const res = mockResponse();
      await AuthControllers.updateSelf(req, res, vi.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });
  });

  it("updates user with same ID", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUserByLogin.mockResolvedValue({
        id: seed.users[0].id,
        login: "some-login",
        photoURL: "some-url",
      });

      const req = mockRequest({
        validated: {
          body: {
            firstName: "John",
            lastName: "Doe",
            login: "login1",
            password: "pass1",
          },
        },
        user: seed.users[0],
      });
      const res = mockResponse();

      await AuthControllers.updateSelf(req, res, vi.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });
  });

  it("blocks duplicate login for different users", async () => {
    await seedProvider(async (seed) => {
      mockUserService.getUserByLogin.mockResolvedValue({
        id: "some-id",
        login: "login1",
        photoURL: "some-url",
      });

      const req = mockRequest({
        validated: {
          body: {
            firstName: "John",
            lastName: "Doe",
            login: "login1",
            password: "pass1",
          },
        },
        user: seed.users[0],
      });
      const res = mockResponse();

      await AuthControllers.updateSelf(req, res, vi.fn());

      expect(respond).toHaveBeenCalledWith(
        StatusCodes.CONFLICT,
        expect.anything(),
      );
    });
  });
});
